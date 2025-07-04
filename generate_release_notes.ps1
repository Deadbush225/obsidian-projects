# ━━━━━━━━━━━━━━━━━━━━━━━ BUILD RELEASE NOTES ━━━━━━━━━━━━━━━━━━━━━━ #
$release_notes = "./release_notes.md"

# ━━━━━━━━━━━━━━━━━━━━━━━━━ CREATE RELEASE ━━━━━━━━━━━━━━━━━━━━━━━━━ #
# Read the version from package.json
$packageJsonPath = "./package.json"
$packageJsonContent = Get-Content -Path $packageJsonPath -Raw | ConvertFrom-Json
$version = $packageJsonContent.version
$beta = $true  # Set this to $true or $false as needed

$arguments = @(
    "release create",
    $version,
    "./manifest.json",
    "./main.js", 
    "./styles.css",
    "--title",
    "$version",
    "--notes-file",
    $release_notes,
    "--repo", 
    "Deadbush225/obsidian-projects"
)

if ($beta) {
    $arguments += "--prerelease"
}
Start-Process "gh" -ArgumentList ($arguments -join " ") -NoNewWindow -Wait
Write-Host "Release created"
