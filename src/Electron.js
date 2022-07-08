import { app, BrowserWindow
  , ipcMain, ipcRenderer, dialog, shell, safeStorage
  , clipboard
 } from "electron"

export const whenReadyImpl = () => app.whenReady()
export const newBrowserWindow = (config) => () => new BrowserWindow(config)

export const loadFileImpl = (name) => (browserWindow) => () =>
  browserWindow.loadFile(name)

export const loadUrlImpl = (name) => (browserWindow) => () =>
  browserWindow.loadURL(name)

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

export const getUserDataDirectory = () => app.getPath("userData")

export const isDefaultProtocolClient =
  protocol => () => app.isDefaultProtocolClient(protocol)

export const setAsDefaultProtocolClient =
  protocol => () => app.setAsDefaultProtocolClient(protocol)

export const close = (win) => () => win.close()


export const onLocalhostRedirect = (urlCallback) => (win) => () => {
      win.webContents.on('will-redirect',
        async (e, url) => {
      if(url.startsWith("http://127.0.0.1")) {
         urlCallback(url)()
         e.preventDefault()
      }
  });
}
export const setWindowOpenHandlerToExternal = win => () => {
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) {
        shell.openExternal(url);
    }
    return { action: 'deny' };
});
}

export const isEncryptionAvailable = () => {
  return safeStorage.isEncryptionAvailable()
}

export const encryptStringImpl = (just, nothing, plainText) => {
  try {
    const res = safeStorage.encryptString(plainText)
    return just(res)
  } catch {
    return nothing;
  }
}

export const decryptStringImpl = (just, nothing, buffer) => {
  try {
    const res = safeStorage.decryptString(buffer)
    return just(res)
  } catch {
    return nothing;
  }
}

export const copyToClipboard = (text) => () => clipboard.writeText(text)
export const getClipboardText = () => clipboard.readText()
export const showWhenReadyToShow =
  (win) => () => {
    win.once("ready-to-show", () => win.show())
  }

export const appendSwitch = name => value => () =>
  (app.commandLine.appendSwitch(name, value))