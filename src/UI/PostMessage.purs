module UI.PostMessage where

import Prelude
import Effect (Effect)
import Foreign (Foreign)
import Yoga.JSON (class WriteForeign, write)

foreign import postMessageImpl :: Foreign -> Effect Unit

postMessage :: forall msg. WriteForeign msg => msg -> Effect Unit
postMessage = write >>> postMessageImpl