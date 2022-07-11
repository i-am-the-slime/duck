export const sendToMainImpl = (message) => (channel) => () =>
  window.electronAPI.sendToMain(message, channel)

export const on = (channel) => (handler) => () =>
  window.electronAPI.on(channel, handler)