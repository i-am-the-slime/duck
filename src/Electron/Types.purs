module Electron.Types where

import Prelude
import Yoga.JSON (class ReadForeign, class WriteForeign)

newtype Channel = Channel String

derive newtype instance Eq Channel
derive newtype instance Ord Channel
derive newtype instance WriteForeign Channel
derive newtype instance ReadForeign Channel

newtype Protocol = Protocol String

instance Show Protocol where
  show (Protocol proto) = proto