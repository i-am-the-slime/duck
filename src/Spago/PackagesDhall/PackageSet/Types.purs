module Spago.PackagesDhall.PackageSet.Types where

import Biz.Github.Types (Repository)
import Biz.Spago.Types (ProjectName, Version)
import Data.Map (Map)

type PackageSet = Map ProjectName PackageSetEntry

type PackageSetEntry =
  { dependencies ∷ Array ProjectName
  , repo ∷ Repository
  , version ∷ Version
  }
