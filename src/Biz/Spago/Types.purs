module Biz.Spago.Types where

import Prelude

import Data.Newtype (class Newtype)
import Yoga.JSON (class ReadForeign, class WriteForeign)

newtype ProjectName = ProjectName String

derive instance Newtype ProjectName _
derive newtype instance Show ProjectName
derive newtype instance Eq ProjectName
derive newtype instance Ord ProjectName
derive newtype instance WriteForeign ProjectName
derive newtype instance ReadForeign ProjectName

newtype SourceGlob = SourceGlob String

derive instance Newtype SourceGlob _
derive newtype instance Show SourceGlob
derive newtype instance Eq SourceGlob
derive newtype instance Ord SourceGlob
derive newtype instance WriteForeign SourceGlob
derive newtype instance ReadForeign SourceGlob

newtype Version = Version String

derive newtype instance Show Version
derive newtype instance Eq Version
derive newtype instance Ord Version
derive newtype instance WriteForeign Version
derive newtype instance ReadForeign Version
