import { app, BrowserWindow, ipcMain, ipcRenderer, dialog } from "electron"

export const whenReadyImpl = () => app.whenReady()
export const newBrowserWindow = (config) => () => new BrowserWindow(config)

export const loadFileImpl = (name) => (browserWindow) => () =>
  browserWindow.loadFile(name)

export const sendIPCRendererMessageImpl = (message, channel) =>
  ipcRenderer.send(channel, message)

export const onIPCMainMessage = (listener) => (channel) => () => {
  ipcMain.on(channel, listener)
}

export const onIPCRendererMessage = (listener) => (channel) => () => {
  ipcRenderer.on(channel, listener)
}

export const showOpenDialogImpl = (options) => (window) => () =>
  dialog.showOpenDialog(window, options)

export const sendToWebContentsImpl = (message) => (channel) => (win) => () => {
  win.webContents.send(channel, message)
}

export const removeEventListener =
  (eventType) => (handler) => (browserWindow) => () =>
    browserWindow.removeEventListener(eventType, handler)

export const ipcRendererImpl = ipcRenderer
