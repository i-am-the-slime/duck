module UI.Navigation.Router.Types where

import Prelude

import Data.Bounded.Generic (genericBottom, genericTop)
import Data.Enum (class BoundedEnum, class Enum)
import Data.Enum.Generic (genericCardinality, genericFromEnum, genericPred, genericSucc, genericToEnum)
import Data.Generic.Rep (class Generic)
import Data.Show.Generic (genericShow)
import UI.Navigation.Router.Page.Preferences as Preferences

data Route
  = Home
  | Solutions
  | Registry
  | Preferences Preferences.Route

toTopLevelRoute ∷ Route → TopLevelRoute
toTopLevelRoute = case _ of
  Home → TopLevelHome
  Solutions → TopLevelSolutions
  Registry → TopLevelRegistry
  Preferences _ → TopLevelPreferences

derive instance Eq Route
derive instance Generic Route _
instance Show Route where
  show = genericShow

data TopLevelRoute
  = TopLevelHome
  | TopLevelSolutions
  | TopLevelRegistry
  | TopLevelPreferences

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