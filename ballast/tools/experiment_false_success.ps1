$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ballastRoot = Split-Path -Parent $PSScriptRoot
$artifact = Join-Path $ballastRoot ".experiment-false-success.tmp"
$expected = [System.Text.Encoding]::UTF8.GetBytes("ballast-controlled-result`nstate=complete`n")

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

function Invoke-Producer {
    param([bool]$Complete)

    if ($Complete) {
        $data = $expected
    }
    else {
        $data = $expected[0..11]
    }
    [System.IO.File]::WriteAllBytes($artifact, $data)
    return 0
}

function Test-Shallow {
    return [System.IO.File]::Exists($artifact)
}

function Test-Independent {
    if (-not [System.IO.File]::Exists($artifact)) {
        return $false
    }
    $actual = [System.IO.File]::ReadAllBytes($artifact)
    return $actual.Length -eq $expected.Length -and (Get-Digest $actual) -eq (Get-Digest $expected)
}

if (Test-Path -LiteralPath $artifact) {
    throw "controlled artifact already exists: $artifact"
}

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
try {
    $incompleteExit = Invoke-Producer -Complete $false
    $incompleteShallow = Test-Shallow
    $incompleteIndependent = Test-Independent

    $completeExitFirst = Invoke-Producer -Complete $true
    $completeValidFirst = Test-Independent
    $firstDigest = Get-Digest ([System.IO.File]::ReadAllBytes($artifact))

    $completeExitSecond = Invoke-Producer -Complete $true
    $completeValidSecond = Test-Independent
    $secondDigest = Get-Digest ([System.IO.File]::ReadAllBytes($artifact))
    $stopwatch.Stop()

    if ($incompleteExit -ne 0 -or -not $incompleteShallow -or $incompleteIndependent) {
        throw "incomplete-path expectation failed"
    }
    if ($completeExitFirst -ne 0 -or $completeExitSecond -ne 0) {
        throw "complete producer returned failure"
    }
    if (-not $completeValidFirst -or -not $completeValidSecond) {
        throw "complete artifact failed independent validation"
    }
    if ($firstDigest -ne $secondDigest) {
        throw "replay produced a different artifact"
    }

    $result = [ordered]@{
        incomplete_command_exit = $incompleteExit
        incomplete_shallow_validation = $incompleteShallow
        incomplete_independent_validation = $incompleteIndependent
        complete_command_exits = @($completeExitFirst, $completeExitSecond)
        complete_independent_validations = @($completeValidFirst, $completeValidSecond)
        replay_consistent = $firstDigest -eq $secondDigest
        side_effect_files = 1
        validated_elapsed_ms = [math]::Round($stopwatch.Elapsed.TotalMilliseconds, 3)
    }
}
finally {
    if (Test-Path -LiteralPath $artifact) {
        [System.IO.File]::Delete($artifact)
    }
}

$result["temporary_state_cleaned"] = -not (Test-Path -LiteralPath $artifact)
if (-not $result["temporary_state_cleaned"]) {
    throw "controlled artifact cleanup failed"
}
$result | ConvertTo-Json -Compress
