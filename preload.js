const { ipcRenderer, contextBridge } = require("electron")

process.once("loaded", () => {
  window.addEventListener("message", (evt) => {
    ipcRenderer.send(evt.data.type, evt.data)
  })
})

contextBridge.exposeInMainWorld("electronAPI", {
  on: (channel, handler) => {
    // c.f.https://stackoverflow.com/a/68942697/4063261
    const subscription = (event, ...args) => handler(...args);
    ipcRenderer.on(channel, subscription)
    return () => ipcRenderer.removeListener(channel, subscription)
  },
  sendToMain: (message, channel) => ipcRenderer.send(channel, message)
})
