module Backend.Tool.Spago.Types where

import Prelude

import Data.Newtype (class Newtype)
import Yoga.JSON (class ReadForeign, class WriteForeign)

newtype SpagoGlobalCacheDir = SpagoGlobalCacheDir String

derive instance Newtype SpagoGlobalCacheDir _
derive instance Eq SpagoGlobalCacheDir
derive instance Ord SpagoGlobalCacheDir
derive newtype instance Show SpagoGlobalCacheDir
derive newtype instance WriteForeign SpagoGlobalCacheDir
derive newtype instance ReadForeign SpagoGlobalCacheDir