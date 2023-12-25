"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("version").textContent = `Welcome to V${process.env.npm_package_version}!`;
    electron_1.ipcRenderer.on("msg", (e, msg) => document.getElementById("log").textContent = msg);
});
