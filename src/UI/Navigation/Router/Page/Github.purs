module UI.Navigation.Router.Page.Github where

import Prelude hiding ((/))

import Biz.Github.Types (Owner, Repository)
import Data.Generic.Rep (class Generic)
import Data.Lens.Iso.Newtype (_Newtype)
import Data.Show.Generic (genericShow)
import Routing.Duplex (RouteDuplex')
import Routing.Duplex as R
import Routing.Duplex as RD
import Routing.Duplex.Generic as RG
import Routing.Duplex.Generic.Syntax ((/))

data Route = Root | Repository Owner Repository

owner ∷ RouteDuplex' Owner
owner = _Newtype RD.segment

repository ∷ RouteDuplex' Repository
repository = _Newtype RD.segment

subRoute ∷ RouteDuplex' Route
subRoute =
  R.root
    $ RG.sum
        { "Root": RG.noArgs
        , "Repository": "repository" / owner / repository
        }

-- Trash
derive instance Generic Route _
derive instance Eq Route
derive instance Ord Route
instance Show Route where
  show = genericShow