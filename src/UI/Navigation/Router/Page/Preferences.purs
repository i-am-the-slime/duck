module UI.Navigation.Router.Page.Preferences where

import Prelude hiding ((/))

import Data.Bounded.Generic (genericBottom, genericTop)
import Data.Enum (class BoundedEnum, class Enum)
import Data.Enum.Generic (genericCardinality, genericFromEnum, genericPred, genericSucc, genericToEnum)
import Data.Generic.Rep (class Generic)
import Data.Show.Generic (genericShow)
import Routing.Duplex (RouteDuplex')
import Routing.Duplex as R
import Routing.Duplex.Generic as RG
import Routing.Duplex.Generic.Syntax ((/))

data Route = Root | Spago

subRoute ∷ RouteDuplex' Route
subRoute =
  R.root
    $ RG.sum
        { "Root": RG.noArgs
        , "Spago": "spago" / RG.noArgs
        }

-- Trash
derive instance Generic Route _
derive instance Eq Route
derive instance Ord Route
instance Show Route where
  show = genericShow

instance Bounded Route where
  bottom = genericBottom
  top = genericTop

instance Enum Route where
  succ = genericSucc
  pred = genericPred

instance BoundedEnum Route where
  cardinality = genericCardinality
  toEnum = genericToEnum
  fromEnum = genericFromEnum