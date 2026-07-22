$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ballastRoot = Split-Path -Parent $PSScriptRoot
$artifact = Join-Path $ballastRoot ".experiment-interrupted-manifest.tmp"
$stage = Join-Path $ballastRoot ".experiment-interrupted-manifest.stage"
$backup = Join-Path $ballastRoot ".experiment-interrupted-manifest.backup"
$items = @("alpha", "beta")

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

function Get-ExpectedText {
    $payload = $items -join "|"
    $payloadDigest = Get-Digest ([System.Text.Encoding]::UTF8.GetBytes($payload))
    return "status=complete`nitem_count=2`nitem_1=alpha`nitem_2=beta`npayload_sha256=$payloadDigest`n"
}

function Get-InvalidCandidateText {
    $invalidDigest = "0" * 64
    return "status=complete`nitem_count=2`nitem_1=alpha`nitem_2=beta`npayload_sha256=$invalidDigest`n"
}

function Invoke-InterruptedProducer {
    $partial = "status=writing`nitem_count=2`nitem_1=alpha`n"
    [System.IO.File]::WriteAllText($artifact, $partial, [System.Text.UTF8Encoding]::new($false))
    return 0
}

function Write-Candidate {
    param([string]$Text)

    [System.IO.File]::WriteAllText($stage, $Text, [System.Text.UTF8Encoding]::new($false))
    return 0
}

function Read-Manifest {
    param([string]$Path)

    if (-not [System.IO.File]::Exists($Path)) {
        return $null
    }
    $values = @{}
    foreach ($line in [System.IO.File]::ReadAllLines($Path, [System.Text.Encoding]::UTF8)) {
        if (-not $line) {
            continue
        }
        $separator = $line.IndexOf("=")
        if ($separator -le 0) {
            return $null
        }
        $key = $line.Substring(0, $separator)
        if ($values.ContainsKey($key)) {
            return $null
        }
        $values[$key] = $line.Substring($separator + 1)
    }
    return $values
}

function Test-Structure {
    param([string]$Path)

    $manifest = Read-Manifest -Path $Path
    if ($null -eq $manifest) {
        return $false
    }
    $required = @("status", "item_count", "item_1", "item_2", "payload_sha256")
    return $manifest.Count -eq $required.Count -and -not ($required | Where-Object { -not $manifest.ContainsKey($_) })
}

function Test-Semantic {
    param([string]$Path)

    if (-not (Test-Structure -Path $Path)) {
        return $false
    }
    $manifest = Read-Manifest -Path $Path
    $count = 0
    if (-not [int]::TryParse($manifest["item_count"], [ref]$count) -or $count -le 0) {
        return $false
    }
    $actualItems = @(1..$count | ForEach-Object { $manifest["item_$_"] })
    if ($actualItems.Count -ne $count -or $actualItems -contains $null) {
        return $false
    }
    $payloadDigest = Get-Digest ([System.Text.Encoding]::UTF8.GetBytes(($actualItems -join "|")))
    return $manifest["status"] -eq "complete" -and $payloadDigest -eq $manifest["payload_sha256"]
}

foreach ($path in @($artifact, $stage, $backup)) {
    if (Test-Path -LiteralPath $path) {
        throw "controlled path already exists: $path"
    }
}

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
try {
    $interruptedExit = Invoke-InterruptedProducer
    $interruptedExists = Test-Path -LiteralPath $artifact
    $interruptedStructure = Test-Structure -Path $artifact
    $interruptedSemantic = Test-Semantic -Path $artifact
    $partialDigest = Get-Digest ([System.IO.File]::ReadAllBytes($artifact))

    $invalidCandidateExit = Write-Candidate -Text (Get-InvalidCandidateText)
    $invalidCandidateStructure = Test-Structure -Path $stage
    $invalidCandidateSemantic = Test-Semantic -Path $stage
    $invalidCandidateBlocked = $invalidCandidateStructure -and -not $invalidCandidateSemantic
    if ($invalidCandidateBlocked) {
        [System.IO.File]::Delete($stage)
    }
    $invalidCandidateStatePreserved = (Get-Digest ([System.IO.File]::ReadAllBytes($artifact))) -eq $partialDigest

    $validCandidateExit = Write-Candidate -Text (Get-ExpectedText)
    $validCandidateStructure = Test-Structure -Path $stage
    $validCandidateSemantic = Test-Semantic -Path $stage
    $replacementSucceeded = $false
    $replacementErrorType = "none"
    try {
        [System.IO.File]::Replace($stage, $artifact, $backup)
        $replacementSucceeded = $true
    }
    catch {
        $errorValue = $_.Exception
        if ($null -ne $errorValue.InnerException) {
            $errorValue = $errorValue.InnerException
        }
        $replacementErrorType = $errorValue.GetType().Name
    }

    if ($replacementSucceeded) {
        $targetStateValid = (Test-Structure -Path $artifact) -and (Test-Semantic -Path $artifact)
        $candidateStatePreserved = -not (Test-Path -LiteralPath $stage)
        $safeStop = $false
        $effectiveCompletion = $targetStateValid
    }
    else {
        $targetStateValid = $false
        $targetStatePreserved = (Get-Digest ([System.IO.File]::ReadAllBytes($artifact))) -eq $partialDigest
        $candidateStatePreserved = (Test-Structure -Path $stage) -and (Test-Semantic -Path $stage)
        $safeStop = $targetStatePreserved -and $candidateStatePreserved -and -not (Test-Path -LiteralPath $backup)
        $effectiveCompletion = $false
    }
    $stopwatch.Stop()

    if ($interruptedExit -ne 0 -or -not $interruptedExists) {
        throw "interrupted producer expectation failed"
    }
    if ($interruptedStructure -or $interruptedSemantic) {
        throw "interrupted artifact passed independent validation"
    }
    if ($invalidCandidateExit -ne 0 -or -not $invalidCandidateBlocked -or -not $invalidCandidateStatePreserved) {
        throw "invalid candidate was not safely blocked"
    }
    if ($validCandidateExit -ne 0 -or -not $validCandidateStructure -or -not $validCandidateSemantic) {
        throw "valid candidate preparation failed"
    }
    if (-not $replacementSucceeded -and -not $safeStop) {
        throw "replacement failure polluted controlled state"
    }
    if ($replacementSucceeded -and -not $effectiveCompletion) {
        throw "replacement succeeded without a valid target"
    }

    $result = [ordered]@{
        interrupted_command_exit = $interruptedExit
        interrupted_existence_validation = $interruptedExists
        interrupted_structure_validation = $interruptedStructure
        interrupted_semantic_validation = $interruptedSemantic
        invalid_candidate_structure_validation = $invalidCandidateStructure
        invalid_candidate_semantic_validation = $invalidCandidateSemantic
        invalid_candidate_blocked = $invalidCandidateBlocked
        invalid_candidate_state_preserved = $invalidCandidateStatePreserved
        valid_candidate_validation = $validCandidateStructure -and $validCandidateSemantic
        replacement_succeeded = $replacementSucceeded
        replacement_error_type = $replacementErrorType
        candidate_state_preserved = $candidateStatePreserved
        safe_stop = $safeStop
        effective_completion = $effectiveCompletion
        validated_elapsed_ms = [math]::Round($stopwatch.Elapsed.TotalMilliseconds, 3)
    }
}
finally {
    foreach ($path in @($stage, $backup, $artifact)) {
        if (Test-Path -LiteralPath $path) {
            [System.IO.File]::Delete($path)
        }
    }
}

$result["temporary_state_cleaned"] = -not (Test-Path -LiteralPath $artifact) -and -not (Test-Path -LiteralPath $stage) -and -not (Test-Path -LiteralPath $backup)
if (-not $result["temporary_state_cleaned"]) {
    throw "controlled state cleanup failed"
}
$result | ConvertTo-Json -Compress
