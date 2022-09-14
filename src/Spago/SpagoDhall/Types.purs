module Spago.SpagoDhall.Types where


import Biz.Github.Types (Repository)
import Biz.Spago.Types (ProjectName, SourceGlob)
import Data.Maybe (Maybe)
import Dhall.Types (LocalImport)

type SpagoDhall =
  { leadingComment ∷ Maybe String
  , name ∷ ProjectName
  , dependencies ∷ Array ProjectName
  , packages ∷ LocalImport
  , sources ∷ Array SourceGlob
  , repository ∷ Maybe Repository
  , license ∷ Maybe String
  }
