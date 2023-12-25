import { ipcRenderer } from "electron"

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("version")!.textContent = `Welcome to V${process.env.npm_package_version}!`
    ipcRenderer.on("msg", (e,msg) => document.getElementById("log")!.textContent = msg)
})