# Deploy backend, frontend, and admin to Vercel with env vars from each app's .env file.
# Usage: npm run deploy:vercel
# First time: npx vercel login

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")

$apps = @(
    @{
        Dir     = "backend"
        Project = "backend-office-e"
        EnvFile = "deploy/vercel-import/backend.env"
    },
    @{
        Dir     = "frontend"
        Project = "office-website"
        EnvFile = "deploy/vercel-import/frontend.env"
    },
    @{
        Dir     = "admin"
        Project = "admin-office-nine"
        EnvFile = "deploy/vercel-import/admin.env"
    }
)

function Write-Step($msg) {
    Write-Host ""
    Write-Host "==> $msg" -ForegroundColor Green
}

function Invoke-NpxVercel {
    param(
        [Parameter(ValueFromRemainingArguments = $true)]
        [string[]]$Args
    )

    $prev = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        & npx vercel @Args
        return $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $prev
    }
}

function Test-VercelAuth {
    $code = Invoke-NpxVercel "whoami"
    if ($code -ne 0) {
        Write-Host "Vercel login required. Opening login..." -ForegroundColor Yellow
        Invoke-NpxVercel "login" | Out-Null
        $code = Invoke-NpxVercel "whoami"
        if ($code -ne 0) {
            throw "Vercel login failed. Run: npx vercel login"
        }
    }
    Write-Host "Vercel account: fk5095129-5401 (logged in)" -ForegroundColor Cyan
}

function Import-EnvFile {
    param([string]$Path)

    $vars = @{}
    if (-not (Test-Path $Path)) {
        throw "Env file not found: $Path"
    }

    Get-Content $Path | ForEach-Object {
        $line = $_.Trim()
        if ($line -eq "" -or $line.StartsWith("#")) { return }
        if ($line -match '^([A-Za-z_][A-Za-z0-9_]*)=(.*)$') {
            $name = $matches[1]
            $value = $matches[2].Trim().Trim('"').Trim("'")
            if ($name -eq "PORT") { return }
            $vars[$name] = $value
        }
    }

    return $vars
}

function Push-VercelEnv {
    param(
        [hashtable]$Vars
    )

    foreach ($name in $Vars.Keys) {
        $value = $Vars[$name]
        if ([string]::IsNullOrWhiteSpace($value)) { continue }

        Write-Host "  env: $name" -ForegroundColor DarkCyan
        foreach ($target in @("production", "preview", "development")) {
            $prev = $ErrorActionPreference
            $ErrorActionPreference = "Continue"
            try {
                $value | & npx vercel env add $name $target --force 2>$null | Out-Null
            } finally {
                $ErrorActionPreference = $prev
            }
        }
    }
}

Write-Step "Checking Vercel CLI login"
Test-VercelAuth

foreach ($app in $apps) {
    $appPath = Join-Path $root $app.Dir
    $envPath = Join-Path $root $app.EnvFile

    Write-Step "[$($app.Dir)] Link project '$($app.Project)'"
    Push-Location $appPath
    try {
        if (Test-Path ".vercel") {
            Remove-Item -Recurse -Force ".vercel"
        }

        $code = Invoke-NpxVercel "link", "--yes", "--project", $app.Project
        if ($code -ne 0) {
            throw "Failed to link project $($app.Project)"
        }

        Write-Step "[$($app.Dir)] Push environment variables"
        $vars = Import-EnvFile $envPath
        Push-VercelEnv $vars

        Write-Step "[$($app.Dir)] Deploy to production"
        $code = Invoke-NpxVercel "deploy", "--prod", "--yes"
        if ($code -ne 0) {
            throw "Deploy failed for $($app.Dir)"
        }
    }
    finally {
        Pop-Location
    }
}

Write-Step "All deployments finished!"
Write-Host "Backend:  https://backend-office-e.vercel.app/api/health"
Write-Host "Frontend: https://office-website-mu.vercel.app"
Write-Host "Admin:    https://admin-office-nine.vercel.app/login"
