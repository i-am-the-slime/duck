module Spago.PackagesDhall.Types where

import Prelude

import Biz.Github.Types (Repository)
import Biz.Spago.Types (Version)
import Data.Eq.Generic (genericEq)
import Data.Generic.Rep (class Generic)
import Data.Maybe (Maybe)
import Data.Show.Generic (genericShow)
import Spago.SpagoDhall.Types (DependencyName)

type PackagesDhall =
  { leadingComment ∷ String
  , packageSet ∷ { link ∷ String, sha ∷ Maybe String }
  , changes ∷ Array { name ∷ DependencyName, change ∷ Change }
  }

data Change
  = CompleteChange
      { dependencies ∷ Array DependencyName
      , repo ∷ Repository
      , version ∷ Version
      }
  | DependenciesChange (Array DependencyName)
  | RepoChange Repository
  | VersionChange Version

derive instance Generic Change _
instance Show Change where
  show = genericShow

instance Eq Change where
  eq = genericEq
