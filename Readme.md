# Electron Updater

*Steps to enable `electron-builder`'s `autoUpdater`.*

Initial Steps
-

1. Create a new Electron project.
2. Install `electron-builder` under `devDependencies`, and `electron-updater` under `dependencies`.

```
npm i electron-builder --save-dev && npm i electron-updater
```

Update `.js`/`.ts` Files
-

3. Import `autoUpdate` (from `electron-updater`, *not* `electron`) into `main.js`:

```typescript
import { autoUpdater } from "electron-updater"
```

4. Add **Event Listeners** for each of the `autoUpdater` events:

```typescript
// main.js/ts

const sendStatusToWindow = (msg: string) => win!.webContents.send("msg",msg)

autoUpdater.on("checking-for-update", () => sendStatusToWindow("Checking for update..."))
autoUpdater.on("update-available", info => sendStatusToWindow(`Update available (${info.version})`))
autoUpdater.on("update-not-available", () => sendStatusToWindow('Latest version installed'))
autoUpdater.on("download-progress", progressObj => sendStatusToWindow(`Downloading: ${parseInt(progressObj.percent.toString())}% (${parseInt((progressObj.bytesPerSecond * 1000000).toString())}MB) | ${parseInt((progressObj.transferred * 1000000).toString())}MB/${parseInt((progressObj.total * 1000000).toString())}MB`))
autoUpdater.on("update-downloaded", () => {
    sendStatusToWindow("Update downloaded")
    autoUpdater.quitAndInstall()
})
autoUpdater.on("error", err => {
    document.body.setAttribute("error","")
    sendStatusToWindow(`Error getting update: ${err.message}`)
})

autoUpdater.checkForUpdates()
```

> `autoUpdater.checkforUpdates()` will start the update checking process.

```typescript
// renderer.js/ts

import { ipcRenderer } from "electron"

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("version")!.textContent = `Welcome to V${process.env.npm_package_version}!`
    ipcRenderer.on("msg", (e,msg) => document.getElementById("log")!.textContent = msg)
})
```

Update `package.json`
-

5. Update your `package.json` with the following:

```json
{
    "scripts": {
        "publish": "electron-builder -p always"
    },
    // ...Other keys
    "repository": {
        "url": "https://github.com/<owner>/<repo>.git" // Replace `<owner>`/`<repo>` accordingly
    },
    "build": {
        "appId": "com.${name}.${author}",
        "productName": "Electron Updater",
        "win": {
            "target": "nsis"
        },
        "nsis": {
            "oneClick": true // `false` creates assisted installer,
            "artifactName": "electronupdater_v${version}.exe" // The name of the generated installer EXE file,
            "createDesktopShortcut": false // `true` creates desktop shortcut (or gives the option as a checkbox in assisted installer if `oneClick` is `false`),
            "deleteAppDataOnUninstall": true // Only applicable if `oneClick` is `true`,
            "shortcutName": "Electron Updater (V${version})" // Applies to both Desktop and Start Menu shortcuts
        }
    }
}
```

> `"nsis" { "allowToChangeInstallationDirectory": true }` will currently allow updates to be downloaded, but will then wipe the install location without attempting to reinstall (after quitting to install updates), effectively bricking the current install of your application. Not recommended.

Commits and Release Drafts
-

6. Commit the project files to a repo (new or existing).
7. In this repo, create a **Draft** for a new **Release**.

> Click `Releases` > `Draft New Release`, then click `Save as Draft` once finished.

- ⚠ Make sure the `tag` for the draft matches your intended version number, and ensure it starts with `v` (*e.g. `v0.0.0`*). 

> You can disable this in the `build { "publish": { ... } }` section of `package.json` if only numbers are preferred for the version check:

```json
"build": {
    "publish": {
        "vPrefixedTagName": false // `true` by default
    }
}
```

- Enter Release title/description (this can be anything you like).

> ⚠ The included **commit description** for the Release will be the **latest commit description** - make sure you've commited your most recent code *before* creating the Release for accuracy!

- Click `Save as Draft` to save the Release as a Draft.

Create GitHub Access Token
-

9. Create a [Personal Access Token](https://github.com/settings/tokens) on GitHub.

- ⚠ Ensure this token has `Repo` permissions in order to allow proper access for the `autoUpdater` (easier using a **"Classic"** token).

10. Create an **Environmental Variable** for the **Personal Access Token**:

### Windows GUI
- Open the Start Menu, type `env` and select **Edit the system environmental variables**.
- Click the `Environmental Variables...` button.
- Under **"User variables for `%userprofile%`"**, click **New...**:

> - **Variable name**: `GH_TOKEN`
> - **Variable value**: `<Your Personal Access Token>`

### Powershell
- Open a **Powershell** window and run the following command to set a global variable for the token:

```
[Environment]::SetEnvironmentVariable("GH_TOKEN","<Your Personal Access Token>","User")
```

> Replace `"<Your Personal Access Token>"` accordingly.

Publish Release
-

> ⚠ Make sure the `"version"` string in `package.json` matches the version tag of the Release drafted on GitHub!

10. Run the `electron-builder` `"publish"` script created earlier in `package.json`:

```
npm run publish
```

> ℹ If you see `⨯ cannot execute  cause=exit status 1 errorOut=Fatal error: Unable to commit changes` when running the above script, just wait (until the script states `Building target=nsis...`). The `publish` command will first try to sign your release before publishing, but will fail if no signing logic has been provided, but should continue anyway.

Publish Release
-

11. Once the `publish` command has been completed (and you see the **Setup EXE** under **Assets**), go to your Release on GitHub > `Edit Release` > `Publish Release`.

12. Once your app checks for updates, the `autoUpdater` will now prompt to update.

> Note: This sometimes takes a while.