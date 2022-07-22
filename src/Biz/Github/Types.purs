module Biz.Github.Types where

import Prelude

import Data.Newtype (class Newtype)
import Yoga.JSON (class ReadForeign, class WriteForeign)

newtype Login = Login String

derive instance Newtype Login _
derive instance Eq Login
derive instance Ord Login
derive newtype instance Show Login
derive newtype instance WriteForeign Login
derive newtype instance ReadForeign Login

newtype Repository = Repository String

derive instance Newtype Repository _
derive instance Eq Repository
derive instance Ord Repository
derive newtype instance Semigroup Repository
derive newtype instance Show Repository
derive newtype instance WriteForeign Repository
derive newtype instance ReadForeign Repository