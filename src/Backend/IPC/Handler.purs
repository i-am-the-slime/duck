module Backend.IPC.Handler (registerAllHandlers) where

import Prelude

import Biz.IPC.Message.Types (MessageToMain)
import Biz.IPC.MessageToMainHandler (handleMessageToMain)
import Data.Either (either)
import Data.UUID (UUID)
import Debug (spy)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Uncurried (mkEffectFn2)
import Electron (BrowserWindow, onIPCMainMessage)
import Electron.Types (Channel(..))
import Foreign (Foreign)
import Partial.Unsafe (unsafeCrashWith)
import Unsafe.Coerce (unsafeCoerce)
import Yoga.JSON as JSON

registerHandler ∷
  (UUID → MessageToMain → Aff Unit) → Effect Unit
registerHandler handle = do
  let
    listener = mkEffectFn2 \_ev fgn → do
      let
        _ = spy "fgn" fgn

        msg ∷ { data ∷ { message_id ∷ UUID, payload ∷ Foreign } }
        msg = unsafeCoerce fgn

        message ∷ MessageToMain
        message = JSON.read msg.data.payload # either
          (unsafeCrashWith <<< show)
          identity
      launchAff_ (handle msg.data.message_id message)
  onIPCMainMessage listener (Channel "ipc")

registerAllHandlers ∷ BrowserWindow → Effect Unit
registerAllHandlers window =
  registerHandler (handleMessageToMain window)
