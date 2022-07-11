module Image where

import Prelude
import Effect (Effect)
import Web.Event.EventTarget (EventTarget)

foreign import setFallbackImgSrc ∷ String → EventTarget → Effect Unit