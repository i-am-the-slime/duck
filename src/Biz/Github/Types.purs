module Biz.Github.Types where

import Prelude

import Data.Monoid (class Semigroup)
import Data.Newtype (class Newtype)
import Yoga.JSON (class ReadForeign, class WriteForeign)

newtype Owner = Owner String

derive instance Newtype Owner _
derive instance Eq Owner
derive instance Ord Owner
derive newtype instance Show Owner
derive newtype instance WriteForeign Owner
derive newtype instance ReadForeign Owner

newtype Repository = Repository String

derive instance Newtype Repository _
derive instance Eq Repository
derive instance Ord Repository
derive newtype instance Semigroup Repository
derive newtype instance Show Repository
derive newtype instance WriteForeign Repository
derive newtype instance ReadForeign Repository