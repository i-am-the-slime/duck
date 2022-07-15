const { ipcRenderer, contextBridge } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {
  on: (channel, handler) => {
    console.log("help", channel, handler)
    // c.f.https://stackoverflow.com/a/68942697/4063261
    const subscription = (event, ...args) => handler(...args);
    ipcRenderer.on(channel, subscription)
    return () => ipcRenderer.removeListener(channel, subscription)
  },
  sendToMain: evt => {
    console.log("I should send", evt)
    ipcRenderer.send(evt.type, evt)
  }
})
