module Spago.PackagesDhall.PackageSet.Parser where

import Prelude

import Data.Either (Either)
import Data.Map as Map
import Dhall.Parser as DhallParser
import Parsing (ParseError, runParser)
import Parsing.String (eof)
import Spago.PackagesDhall.PackageSet.Types (PackageSet)

parsePackageSetDhall ∷ String → Either ParseError PackageSet
parsePackageSetDhall s = runParser s do
  rec ← DhallParser.dhallRecordOf (DhallParser.dhallRecord unit)
  eof
  pure Map.empty
