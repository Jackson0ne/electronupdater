"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_updater_1 = require("electron-updater");
const path_1 = __importDefault(require("path"));
let win;
const createwin = () => {
    win = new electron_1.BrowserWindow({
        width: 500,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            backgroundThrottling: false
        }
    });
    win.loadFile(path_1.default.join(__dirname, "../index.html"));
    // win.webContents.openDevTools()
    const sendStatusToWindow = (msg) => win.webContents.send("msg", msg);
    electron_updater_1.autoUpdater.on("checking-for-update", () => sendStatusToWindow("Checking for update..."));
    electron_updater_1.autoUpdater.on("update-available", info => sendStatusToWindow(`Update available (${info.version})`));
    electron_updater_1.autoUpdater.on("update-not-available", () => sendStatusToWindow('Latest version installed'));
    electron_updater_1.autoUpdater.on("download-progress", progressObj => sendStatusToWindow(`Downloading: ${parseInt(progressObj.percent.toString())}% (${parseInt((progressObj.bytesPerSecond * 1000000).toString())}MB) | ${parseInt((progressObj.transferred * 1000000).toString())}MB/${parseInt((progressObj.total * 1000000).toString())}MB`));
    electron_updater_1.autoUpdater.on("update-downloaded", () => {
        sendStatusToWindow("Update downloaded");
        electron_updater_1.autoUpdater.quitAndInstall();
    });
    electron_updater_1.autoUpdater.on("error", err => {
        document.body.setAttribute("error", "");
        sendStatusToWindow(`Error getting update: ${err.message}`);
    });
    electron_updater_1.autoUpdater.checkForUpdates();
};
electron_1.app
    .whenReady()
    .then(createwin)
    .catch(err => console.log(err));
