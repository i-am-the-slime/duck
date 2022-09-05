module Spago.SpagoDhall.Types where

import Prelude

import Data.Newtype (class Newtype)
import Dhall.Types (LocalImport, Glob)
import Yoga.JSON (class ReadForeign, class WriteForeign)

type SpagoDhall =
  { leadingComment ∷ String
  , name ∷ String
  , dependencies ∷ Array DependencyName
  , packages ∷ LocalImport
  , sources ∷ Array Glob
  }

newtype DependencyName = DependencyName String

derive instance Newtype DependencyName _
derive instance Eq DependencyName
derive instance Ord DependencyName
derive newtype instance Show DependencyName
derive newtype instance WriteForeign DependencyName
derive newtype instance ReadForeign DependencyName
