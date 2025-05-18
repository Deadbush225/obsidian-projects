To push an update for your Obsidian plugin, which includes the new Gantt View and any other changes, you'll typically follow these general steps. This involves updating version numbers, preparing release notes, committing your changes to Git, and then creating a new release on GitHub.

Looking at your workspace, you have a generate_release_notes.ps1 script and a version-bump.mjs script that will help with this.

Here's a suggested workflow:

1.  **Update Plugin Version in manifest.json**:

    - Open manifest.json.
    - Increment the `version` number (e.g., from `"1.17.7"` to `"1.18.0"` or a suitable new version).
      ```json
      // filepath: d:\Obsidian Sandbox\Sandbox Vault\.obsidian\plugins\obsidian-projects\manifest.json
      {
        "id": "obsidian-projects",
        "name": "Projects",
        "version": "1.18.0", // <-- UPDATE THIS
        "minAppVersion": "1.0.0",
        "description": "Plain text project planning.",
        "author": "Marcus Olsson",
        "authorUrl": "https://marcus.se.net",
        "fundingUrl": "https://www.buymeacoffee.com/marcusolsson",
        "isDesktopOnly": false
      }
      ```

2.  **Run the Version Bump Script (Optional but Recommended)**:

    - Your [`version-bump.mjs`](../../../../../../d:/Obsidian Sandbox/Sandbox version-bump.mjs ) script updates versions.json based on manifest.json.
    - Open your terminal in the plugin's root directory (`d:\Obsidian Sandbox\Sandbox Vault\.obsidian\plugins\obsidian-projects`).
    - Ensure you have Node.js installed.
    - Run the script:
      ```bash
      node version-bump.mjs
      ```
    - This will set the `npm_package_version` environment variable implicitly if you run it as part of an npm script (e.g., `npm version patch` then `npm run build`). If running manually and you want it to pick up the version from package.json (if you have one and use it for versioning), you might need to adjust how `targetVersion` is obtained in the script or ensure `process.env.npm_package_version` is set. However, as it's written, it seems to expect `npm_package_version` to be set, or you can modify it to take the version from manifest.json directly if you're not using npm for versioning.
    - Alternatively, manually update versions.json to include your new version and the `minAppVersion` from manifest.json.

3.  **Update Version in generate_release_notes.ps1**:

    - Open [`generate_release_notes.ps1`](../../../../../../d:/Obsidian Sandbox/Sandbox Vault/.obsidian/plugins/obsidian-projects/generate_release_notes.ps1).
    - Change the `$version` variable to match the new version you set in manifest.json.
      ```powershell
      // filepath: d:\Obsidian Sandbox\Sandbox Vault\.obsidian\plugins\obsidian-projects\generate_release_notes.ps1
      // ...existing code...
      # ━━━━━━━━━━━━━━━━━━━━━━━━━ CREATE RELEASE ━━━━━━━━━━━━━━━━━━━━━━━━━ #
      $version = "1.18.0" // <-- UPDATE THIS
      $arguments = @(
      // ...existing code...
      )
      Start-Process "gh" -ArgumentList ($arguments -join " ") -NoNewWindow -Wait
      Write-Host "Release created"
      ```

4.  **Prepare Release Notes**:

    - Create or update the release_notes.md file in the root of your plugin directory.
    - Add details about the new Gantt view, bug fixes, and any other changes in this version.
    - The generate_release_notes.ps1 script uses `$release_notes = "./release_notes.md"` for the `--notes-file` argument.

5.  **Build Your Plugin (if necessary)**:

    - If you have a build step (e.g., compiling TypeScript to JavaScript, bundling files), run it now to ensure main.js and styles.css are up-to-date.
      ```bash
      npm run build
      ```
      (This command depends on your package.json scripts.)

6.  **Commit and Push Changes to Git**:

    - Stage all your changes (modified GanttView.svelte, manifest.json, versions.json, generate_release_notes.ps1, release_notes.md, and any built files like main.js, styles.css).
      ```bash
      git add .
      git commit -m "feat: Add Gantt view and release v1.18.0" // Example commit message
      git push origin your-branch-name // Push to your working branch
      ```
    - It's good practice to also tag your commit:
      ```bash
      git tag 1.18.0 // Use the same version number
      git push origin 1.18.0 // Push the tag
      ```

7.  **Create the GitHub Release**:
    - Ensure you are logged into the GitHub CLI (`gh auth login`).
    - Run your PowerShell script from the plugin's root directory:
      ```powershell
      .\generate_release_notes.ps1
      ```
    - This script will use `gh release create` with the specified version, title, notes file, and assets (`manifest.json`, main.js, styles.css) to create a new release on your GitHub repository (`Deadbush225/obsidian-projects`).

After these steps, users of your plugin (especially those using BRAT) should be able to update to the new version.
