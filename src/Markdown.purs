module Markdown (parseMarkDown) where

import Prelude

foreign import marked ∷ String → String
foreign import sanitize ∷ String → String

parseMarkDown ∷ String → String
parseMarkDown = sanitize <<< marked

