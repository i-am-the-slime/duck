module UI.Navigation.Router.Types where

import Prelude

import Data.Bounded.Generic (genericBottom, genericTop)
import Data.Enum (class BoundedEnum, class Enum)
import Data.Enum.Generic (genericCardinality, genericFromEnum, genericPred, genericSucc, genericToEnum)
import Data.Generic.Rep (class Generic)
import Data.Show.Generic (genericShow)

data Route
  = Home
  | Solutions
  | Registry

toTopLevelRoute ∷ Route → TopLevelRoute
toTopLevelRoute = case _ of
  Home → TopLevelHome
  Solutions → TopLevelSolutions
  Registry → TopLevelRegistry

derive instance Eq Route
derive instance Generic Route _
instance Show Route where
  show = genericShow

data TopLevelRoute = TopLevelHome | TopLevelSolutions | TopLevelRegistry

derive instance Generic TopLevelRoute _
derive instance Eq TopLevelRoute
derive instance Ord TopLevelRoute
instance Bounded TopLevelRoute where
  bottom = genericBottom
  top = genericTop

instance Enum TopLevelRoute where
  succ = genericSucc
  pred = genericPred

instance BoundedEnum TopLevelRoute where
  cardinality = genericCardinality
  toEnum = genericToEnum
  fromEnum = genericFromEnum