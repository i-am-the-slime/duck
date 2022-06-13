const { ipcRenderer, contextBridge } = require("electron")

process.once("loaded", () => {
  window.addEventListener("message", (evt) => {
    ipcRenderer.send(evt.data.type, evt.data)
  })
})

contextBridge.exposeInMainWorld("electronAPI", {
  on: (channel, handler) => {
    ipcRenderer.on(channel, handler)
  },
  removeListener: (channel, handler) =>
    ipcRenderer.removeListener(channel, handler),
  sendToMain: (message, channel) => ipcRenderer.send(channel, message)
})
