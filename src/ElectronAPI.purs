module ElectronAPI where

import Prelude

import Effect (Effect)
import Effect.Uncurried (mkEffectFn2)
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
  (IpcRendererEvent → Foreign → Effect Unit) → Effect ElectronListener
mkListener callback = pure $ unsafeCoerce $ mkEffectFn2 callback

foreign import on ∷ Channel → ElectronListener → Effect Unit
foreign import removeListener ∷ Channel → ElectronListener → Effect Unit