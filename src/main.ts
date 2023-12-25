import { app, BrowserWindow } from "electron"
import { autoUpdater } from "electron-updater"
import path from "path"

let win

const createwin = () => {
    win = new BrowserWindow({
        width: 500,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            backgroundThrottling: false
        }
    })

    win.loadFile(path.join(__dirname,"../index.html"))
    // win.webContents.openDevTools()

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
}

app
.whenReady()
.then(createwin)
.catch(err => console.log(err))