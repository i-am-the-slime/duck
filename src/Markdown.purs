module Markdown (parseMarkdown) where

import Prelude

foreign import marked ∷ String → String
foreign import sanitize ∷ String → String

parseMarkdown ∷ String → String
parseMarkdown = sanitize <<< marked
