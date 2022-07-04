module Backend.IPC.Handler (registerAllHandlers) where

import Prelude

import Biz.IPC.Message.Types (MessageToMain)
import Biz.IPC.MessageToMainHandler (handleMessageToMain)
import Data.Either (either)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Uncurried (mkEffectFn2)
import Electron (BrowserWindow, onIPCMainMessage)
import Electron.Types (Channel(..))
import Partial.Unsafe (unsafeCrashWith)
import Unsafe.Coerce (unsafeCoerce)
import Yoga.JSON as JSON

registerHandler ∷
  (MessageToMain → Aff Unit) → Effect Unit
registerHandler handle = do
  let
    listener = mkEffectFn2 \_ev fgn → do
      let
        message ∷ MessageToMain
        message = JSON.read (unsafeCoerce fgn).data # either
          (unsafeCrashWith <<< show)
          identity
      launchAff_ (handle message)
  onIPCMainMessage listener (Channel "ipc")

registerAllHandlers ∷ BrowserWindow → Effect Unit
registerAllHandlers window =
  registerHandler (handleMessageToMain window)
