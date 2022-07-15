export const sendToMainImpl = (message) => () =>
  window.electronAPI.sendToMain(message)

export const on = (channel) => (handler) => () =>
  window.electronAPI.on(channel, handler)