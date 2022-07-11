module ElectronAPI where

import Prelude

import Effect (Effect)
import Effect.Uncurried (mkEffectFn1)
import Electron.Types (Channel)
import Foreign (Foreign)
import Unsafe.Coerce (unsafeCoerce)
import Yoga.JSON (class WriteForeign)
import Yoga.JSON as JSON

foreign import sendToMainImpl ∷ Foreign → Channel → Effect Unit

sendToMain ∷ ∀ a. WriteForeign a ⇒ a → Channel → Effect Unit
sendToMain msg = sendToMainImpl (JSON.write msg)

foreign import data IpcRendererEvent ∷ Type

foreign import data ElectronListener ∷ Type

mkListener ∷
  (Foreign → Effect Unit) → Effect ElectronListener
mkListener callback = pure $ unsafeCoerce $ mkEffectFn1 callback

foreign import on ∷ Channel → ElectronListener → Effect (Effect Unit)
