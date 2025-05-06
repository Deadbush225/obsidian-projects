# ━━━━━━━━━━━━━━━━━━━━ UPDATE repository FOLDER ━━━━━━━━━━━━━━━━━━━━ #
# Run the update_repository.ps1 script
# & "./scripts/update_repository.ps1"
# ━━━━━━━━━━━━━━━━━━━━━━━ BUILD RELEASE NOTES ━━━━━━━━━━━━━━━━━━━━━━ #

# Define the paths to the installer file and the markdown file
# $installerPath = "./FolderCustomizerSetup-x64.exe"
# $release_template = "./scripts/release_template.md"
$release_notes = "./release_notes.md"

# Read the version from a JSON file
# $jsonFilePath = "./manifest.json"
# $jsonContent = Get-Content -Path $jsonFilePath -Raw | ConvertFrom-Json
# $version = $jsonContent.version

# # Calculate the SHA256 hash of the installer file
# $hash = Get-FileHash -Path $installerPath -Algorithm SHA256 | Select-Object -ExpandProperty Hash

# # Read the content of the markdown file
# $markdownContent = Get-Content -Path $release_template -Raw

# $markdownContent = $markdownContent -replace "%HASH%", $hash

# $markdownContent = $markdownContent -replace "%TITLE%", $version

# # Write the updated content back to the markdown file
# Set-Content -Path $release_notes -Value $markdownContent

# Write-Host "Release notes for " $version "built"

# ━━━━━━━━━━━━━━━━━━━━━━━━━ CREATE RELEASE ━━━━━━━━━━━━━━━━━━━━━━━━━ #
$version = "1.17.6"
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
Start-Process "gh" -ArgumentList ($arguments -join " ") -NoNewWindow -Wait
Write-Host "Release created"
