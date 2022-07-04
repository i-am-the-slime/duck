export const sendToMainImpl = (message) => (channel) => () =>
  window.electronAPI.sendToMain(message, channel)

export const on = (channel) => (handler) => () =>
  window.electronAPI.on(channel, handler)

export const removeListener = (channel) => (handler) => {
  window.electronAPI.removeListener(channel, handler)
  return
}
