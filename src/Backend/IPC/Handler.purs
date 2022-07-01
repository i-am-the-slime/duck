module Backend.IPC.Handler (registerAllHandlers) where

import Prelude

import Biz.IPC.Message.Types (RendererToMainChannel, rendererToMainChannelName)
import Biz.IPC.MessageToMainHandler (handleMessageToMain)
import Data.Enum (enumFromTo)
import Data.Foldable (for_)
import Data.Tuple (uncurry)
import Data.Tuple.Nested (type (/\), (/\))
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Electron (BrowserWindow, onIPCMainMessage)
import Web.Event.EventTarget (eventListener)

registerHandler ∷ RendererToMainChannel → Aff Unit → Effect Unit
registerHandler channel handle = do
  listener ← eventListener $ const $ launchAff_ handle
  onIPCMainMessage listener
    (rendererToMainChannelName channel)

registerAllHandlers ∷ BrowserWindow → Effect Unit
registerAllHandlers window =
  for_ allHandlers (uncurry registerHandler)
  where
  allHandlers ∷ Array (RendererToMainChannel /\ Aff Unit)
  allHandlers = enumFromTo bottom top <#> \channel → do
    let handler = handleMessageToMain window channel
    channel /\ handler
