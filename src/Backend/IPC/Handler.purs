module Backend.IPC.Handler (registerAllHandlers) where

import Prelude

import Biz.IPC.Message.Types (MessageToMain, RendererToMainChannel, rendererToMainChannelName)
import Biz.IPC.MessageToMainHandler (handleMessageToMain)
import Data.Either (either)
import Data.Enum (enumFromTo)
import Data.Foldable (for_)
import Data.Tuple (uncurry)
import Data.Tuple.Nested (type (/\), (/\))
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Uncurried (mkEffectFn2)
import Electron (BrowserWindow, onIPCMainMessage)
import Partial.Unsafe (unsafeCrashWith)
import Unsafe.Coerce (unsafeCoerce)
import Yoga.JSON as JSON

registerHandler ∷
  RendererToMainChannel → (MessageToMain → Aff Unit) → Effect Unit
registerHandler channel handle = do
  let
    listener = mkEffectFn2 \_ev fgn → do
      let
        message ∷ MessageToMain
        message = JSON.read (unsafeCoerce fgn).data # either
          (unsafeCrashWith <<< show)
          identity
      launchAff_ (handle message)
  onIPCMainMessage listener
    (rendererToMainChannelName channel)

registerAllHandlers ∷ BrowserWindow → Effect Unit
registerAllHandlers window =
  for_ allHandlers (uncurry registerHandler)
  where
  allChannels ∷ Array RendererToMainChannel
  allChannels = enumFromTo bottom top

  allHandlers ∷ Array (RendererToMainChannel /\ (MessageToMain → Aff Unit))
  allHandlers = ado
    channel ← allChannels
    in channel /\ (handleMessageToMain window channel)
