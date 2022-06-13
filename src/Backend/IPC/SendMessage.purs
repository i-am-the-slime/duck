module Backend.IPC.SendMessage where

import Prelude

import Biz.IPC.Message.Types (MessageToRenderer, messageToRendererChannel)
import Electron (sendToWebContents)

send (m :: MessageToRenderer) =
  sendToWebContents
    (messageToRendererChannel m)