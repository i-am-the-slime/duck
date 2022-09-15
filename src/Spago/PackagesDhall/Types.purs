module Spago.PackagesDhall.Types where

import Prelude

import Biz.Github.Types (Repository)
import Biz.Spago.Types (ProjectName, Version)
import Data.Eq.Generic (genericEq)
import Data.Generic.Rep (class Generic)
import Data.Maybe (Maybe)
import Data.Ord.Generic (genericCompare)
import Data.Show.Generic (genericShow)
import Dhall.Types (LocalImport)

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
  | LocalLocationChange LocalImport

derive instance Generic Change _
instance Show Change where
  show = genericShow

instance Eq Change where
  eq = genericEq

instance Ord Change where
  compare = genericCompare
