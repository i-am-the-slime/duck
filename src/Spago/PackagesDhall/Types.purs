module Spago.PackagesDhall.Types where

import Prelude

import Biz.Github.Types (Repository)
import Biz.Spago.Types (ProjectName, Version)
import Data.Eq.Generic (genericEq)
import Data.Generic.Rep (class Generic)
import Data.Maybe (Maybe)
import Data.Show.Generic (genericShow)

type PackagesDhall =
  { leadingComment ∷ String
  , packageSet ∷ { link ∷ String, sha ∷ Maybe String }
  , changes ∷ Array { name ∷ ProjectName, change ∷ Change }
  }

data Change
  = CompleteChange
      { dependencies ∷ Array ProjectName
      , repo ∷ Repository
      , version ∷ Version
      }
  | DependenciesChange (Array ProjectName)
  | RepoChange Repository
  | VersionChange Version

derive instance Generic Change _
instance Show Change where
  show = genericShow

instance Eq Change where
  eq = genericEq
