module Backend.IPC.SendMessage where

import Prelude

import Biz.IPC.Message.Types (MessageToRenderer, mainToRendererChannelName, messageToRendererToChannel)
import Effect (Effect)
import Electron (BrowserWindow, sendToWebContents)

send ∷ MessageToRenderer → BrowserWindow → Effect Unit
send (message ∷ MessageToRenderer) window =
  sendToWebContents message
    (mainToRendererChannelName $ messageToRendererToChannel message)
    window