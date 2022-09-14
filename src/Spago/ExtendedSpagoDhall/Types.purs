module Spago.ExtendedSpagoDhall.Types where

import Biz.Spago.Types (ProjectName, SourceGlob)
import Data.Maybe (Maybe)
import Dhall.Types (LocalImport)

type ExtendedSpagoDhall =
  { leadingComment ∷ Maybe String
  , baseFile ∷ { name ∷ String, import ∷ LocalImport }
  , dependencies ∷ Array ProjectName
  , sources ∷ Array SourceGlob
  }
