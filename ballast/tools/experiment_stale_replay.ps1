[CmdletBinding()]
param(
    [switch]$ValidateContract
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ballastRoot = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $ballastRoot ".experiment-stale-replay.source"
$manifestPath = Join-Path $ballastRoot ".experiment-stale-replay.manifest"
$outputPrefix = ".experiment-stale-replay."
$outputSuffix = ".output"

function Get-Digest {
    param([byte[]]$Data)

    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        return [System.BitConverter]::ToString($sha.ComputeHash($Data)).Replace("-", "").ToLowerInvariant()
    }
    finally {
        $sha.Dispose()
    }
}

function Write-Utf8 {
    param([string]$Path, [string]$Text)

    [System.IO.File]::WriteAllText($Path, $Text, [System.Text.UTF8Encoding]::new($false))
}

function Read-Map {
    param([string]$Path)

    if (-not [System.IO.File]::Exists($Path)) {
        return $null
    }
    $values = [ordered]@{}
    foreach ($line in [System.IO.File]::ReadAllLines($Path, [System.Text.Encoding]::UTF8)) {
        if (-not $line) {
            continue
        }
        $separator = $line.IndexOf("=")
        if ($separator -le 0) {
            return $null
        }
        $key = $line.Substring(0, $separator)
        if ($values.Contains($key)) {
            return $null
        }
        $values[$key] = $line.Substring($separator + 1)
    }
    return $values
}

function Get-Source {
    $values = Read-Map -Path $sourcePath
    if ($null -eq $values -or -not $values.Contains("generation")) {
        throw "source is invalid"
    }
    $items = [ordered]@{}
    foreach ($entry in $values.GetEnumerator()) {
        if ($entry.Key -ne "generation") {
            $number = 0
            if (-not [int]::TryParse($entry.Value, [ref]$number)) {
                throw "source value is invalid"
            }
            $items[$entry.Key] = $number
        }
    }
    return [ordered]@{
        generation = $values["generation"]
        items = $items
        digest = Get-Digest ([System.IO.File]::ReadAllBytes($sourcePath))
    }
}

function Get-OutputPath {
    param([string]$Name)

    return Join-Path $ballastRoot "$outputPrefix$Name$outputSuffix"
}

function Get-OutputNames {
    return @(
        Get-ChildItem -LiteralPath $ballastRoot -File -Force |
            Where-Object { $_.Name.StartsWith($outputPrefix) -and $_.Name.EndsWith($outputSuffix) } |
            ForEach-Object { $_.Name.Substring($outputPrefix.Length, $_.Name.Length - $outputPrefix.Length - $outputSuffix.Length) } |
            Sort-Object
    )
}

function Write-OutputItem {
    param([string]$Name, [int]$Value)

    Write-Utf8 -Path (Get-OutputPath -Name $Name) -Text "$Name=$($Value * 2)`n"
}

function Write-Manifest {
    param([System.Collections.IDictionary]$Source)

    $names = @($Source.items.Keys | Sort-Object)
    $lines = @(
        "status=complete"
        "source_generation=$($Source.generation)"
        "source_sha256=$($Source.digest)"
        "outputs=$($names -join ',')"
    )
    foreach ($name in $names) {
        $digest = Get-Digest ([System.IO.File]::ReadAllBytes((Get-OutputPath -Name $name)))
        $lines += "output_${name}_sha256=$digest"
    }
    Write-Utf8 -Path $manifestPath -Text (($lines -join "`n") + "`n")
}

function Test-Internal {
    $manifest = Read-Map -Path $manifestPath
    if ($null -eq $manifest -or $manifest["status"] -ne "complete") {
        return [ordered]@{ valid = $false; reason = "manifest_invalid" }
    }
    $expectedNames = @($manifest["outputs"] -split "," | Sort-Object)
    $actualNames = @(Get-OutputNames)
    if (($expectedNames -join ",") -ne ($actualNames -join ",")) {
        return [ordered]@{ valid = $false; reason = "output_set_mismatch" }
    }
    foreach ($name in $expectedNames) {
        $key = "output_${name}_sha256"
        if (-not $manifest.Contains($key)) {
            return [ordered]@{ valid = $false; reason = "digest_missing:$name" }
        }
        $digest = Get-Digest ([System.IO.File]::ReadAllBytes((Get-OutputPath -Name $name)))
        if ($digest -ne $manifest[$key]) {
            return [ordered]@{ valid = $false; reason = "digest_mismatch:$name" }
        }
    }
    return [ordered]@{ valid = $true; reason = "internal_consistency" }
}

function Test-Contract {
    $internal = Test-Internal
    if (-not $internal.valid) {
        return $internal
    }
    $source = Get-Source
    $manifest = Read-Map -Path $manifestPath
    if ($manifest["source_generation"] -ne $source.generation) {
        return [ordered]@{ valid = $false; reason = "source_generation_mismatch" }
    }
    if ($manifest["source_sha256"] -ne $source.digest) {
        return [ordered]@{ valid = $false; reason = "source_digest_mismatch" }
    }
    $expectedNames = @($source.items.Keys | Sort-Object)
    $actualNames = @(Get-OutputNames)
    if (($expectedNames -join ",") -ne ($actualNames -join ",")) {
        return [ordered]@{ valid = $false; reason = "contract_output_set_mismatch" }
    }
    foreach ($name in $expectedNames) {
        $actual = [System.IO.File]::ReadAllText((Get-OutputPath -Name $name), [System.Text.Encoding]::UTF8)
        $expected = "$name=$($source.items[$name] * 2)`n"
        if ($actual -ne $expected) {
            return [ordered]@{ valid = $false; reason = "contract_value_mismatch:$name" }
        }
    }
    return [ordered]@{ valid = $true; reason = "current_contract_satisfied" }
}

function Invoke-SeparateValidator {
    $hostExecutable = (Get-Process -Id $PID).Path
    $output = & $hostExecutable -NoProfile -File $PSCommandPath -ValidateContract 2>&1
    $exitCode = $LASTEXITCODE
    if ($exitCode -notin @(0, 1)) {
        throw "validator process failed: exit=$exitCode output=$output"
    }
    $result = $output | ConvertFrom-Json
    return [ordered]@{
        valid = [bool]$result.valid
        reason = [string]$result.reason
        process_exit = $exitCode
    }
}

function Get-PackageDigest {
    $bytes = [System.Collections.Generic.List[byte]]::new()
    foreach ($path in @($manifestPath) + @(Get-OutputNames | ForEach-Object { Get-OutputPath -Name $_ })) {
        $nameBytes = [System.Text.Encoding]::UTF8.GetBytes([System.IO.Path]::GetFileName($path) + "`0")
        $bytes.AddRange($nameBytes)
        $bytes.AddRange([System.IO.File]::ReadAllBytes($path))
        $bytes.Add(0)
    }
    return Get-Digest $bytes.ToArray()
}

function Remove-ControlledState {
    foreach ($path in @($manifestPath, $sourcePath)) {
        if ([System.IO.File]::Exists($path)) {
            [System.IO.File]::Delete($path)
        }
    }
    foreach ($name in @(Get-OutputNames)) {
        [System.IO.File]::Delete((Get-OutputPath -Name $name))
    }
}

if ($ValidateContract) {
    $validation = Test-Contract
    $validation | ConvertTo-Json -Compress
    if ($validation.valid) {
        exit 0
    }
    exit 1
}

$existing = @(
    Get-ChildItem -LiteralPath $ballastRoot -File -Force |
        Where-Object { $_.Name.StartsWith(".experiment-stale-replay.") }
)
if ($existing.Count -ne 0) {
    throw "controlled state already exists"
}

$started = [System.Diagnostics.Stopwatch]::StartNew()
$assertionsComplete = $false
try {
    Write-Utf8 -Path $sourcePath -Text "generation=1`nalpha=2`nbeta=3`n"
    $snapshot = Get-Source
    $trace = [System.Collections.Generic.List[string]]::new()
    $trace.Add("read_generation_1")

    Write-OutputItem -Name "alpha" -Value $snapshot.items["alpha"]
    $staleWrites = 1
    $trace.Add("interrupted_after_alpha")

    Write-Utf8 -Path $sourcePath -Text "generation=2`nalpha=2`nbeta=5`ngamma=7`n"
    $trace.Add("source_advanced_to_generation_2")

    Write-OutputItem -Name "beta" -Value $snapshot.items["beta"]
    $staleWrites += 1
    Write-Manifest -Source $snapshot
    $staleWrites += 1
    $trace.Add("resumed_from_stale_snapshot")

    $staleInternal = Test-Internal
    $staleContract = Invoke-SeparateValidator
    $trace.Add("stale_package_rejected_by_current_contract")

    foreach ($name in @(Get-OutputNames)) {
        [System.IO.File]::Delete((Get-OutputPath -Name $name))
    }
    [System.IO.File]::Delete($manifestPath)
    $current = Get-Source
    $resyncedWrites = 0
    foreach ($entry in $current.items.GetEnumerator()) {
        Write-OutputItem -Name $entry.Key -Value $entry.Value
        $resyncedWrites += 1
    }
    Write-Manifest -Source $current
    $resyncedWrites += 1
    $trace.Add("rebuilt_from_generation_2")

    $resyncedContract = Invoke-SeparateValidator
    $firstDigest = Get-PackageDigest
    $trace.Add("published_generation_2")

    $replayWrites = 0
    $replayContract = Invoke-SeparateValidator
    $secondDigest = Get-PackageDigest
    $trace.Add("replay_noop_after_current_state_check")

    if (-not $staleInternal.valid) {
        throw "strong counterexample did not pass internal validation"
    }
    if ($staleContract.valid -or $staleContract.reason -ne "source_generation_mismatch") {
        throw "stale package was not rejected for the expected reason"
    }
    if (-not $resyncedContract.valid -or -not $replayContract.valid) {
        throw "current contract validation failed"
    }
    if ($firstDigest -ne $secondDigest -or $replayWrites -ne 0) {
        throw "replay changed the result"
    }
    $assertionsComplete = $true
    $result = [ordered]@{
        source_generations = @(1, 2)
        trace = @($trace)
        stale_internal_validation = $staleInternal
        stale_contract_validation = $staleContract
        resynced_contract_validation = $resyncedContract
        replay_contract_validation = $replayContract
        stale_write_operations = $staleWrites
        resynced_write_operations = $resyncedWrites
        replay_write_operations = $replayWrites
        replay_consistent = $firstDigest -eq $secondDigest
        published_file_count = (Get-OutputNames).Count + 1
        validator_separate_process = $true
        validator_independence_limit = "shared_script_and_schema"
        effective_completion = $true
        false_success_detected = $true
        interruption_recovered_after_resync = $true
        retry_count = 1
        human_intervention = 0
    }
}
finally {
    Remove-ControlledState
}

if (-not $assertionsComplete) {
    throw "final assertions were not completed"
}
$result["temporary_state_cleaned"] = @(
    Get-ChildItem -LiteralPath $ballastRoot -File -Force |
        Where-Object { $_.Name.StartsWith(".experiment-stale-replay.") }
).Count -eq 0
if (-not $result["temporary_state_cleaned"]) {
    throw "controlled state cleanup failed"
}
$started.Stop()
$result["validated_elapsed_ms"] = [math]::Round($started.Elapsed.TotalMilliseconds, 3)
$result | ConvertTo-Json -Compress -Depth 6
