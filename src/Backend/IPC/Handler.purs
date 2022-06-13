module Backend.IPC.Handler (registerAllHandlers) where

import Prelude

import Biz.IPC.Message.Types (messageToMainChannel)
import Biz.IPC.MessageToMainHandler (handleMessageToMain)
import Data.Enum (enumFromTo)
import Data.Foldable (for_)
import Data.Tuple (uncurry)
import Data.Tuple.Nested (type (/\), (/\))
import Effect (Effect)
import Electron (BrowserWindow, onIPCMainMessage)
import Electron.Types (Channel)
import Web.Event.EventTarget (eventListener)

registerHandler :: Channel -> Effect Unit -> Effect Unit
registerHandler channel handle = do
  listener <- eventListener $ const $ handle
  onIPCMainMessage listener channel

registerAllHandlers :: BrowserWindow -> Effect Unit
registerAllHandlers window =
  for_ allHandlers (uncurry registerHandler)
  where
  allHandlers :: Array (Channel /\ Effect Unit)
  allHandlers = enumFromTo bottom top <#> \messageToMain -> do
    let channel = messageToMainChannel messageToMain
    let handler = handleMessageToMain window messageToMain
    channel /\ handler
