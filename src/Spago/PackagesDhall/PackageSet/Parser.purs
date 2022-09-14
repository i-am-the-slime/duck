module Spago.PackagesDhall.PackageSet.Parser where

import Prelude

import Biz.Github.Types (Repository(..))
import Biz.Spago.Types (ProjectName(..), Version(..))
import Data.Either (Either)
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Data.Traversable (traverse)
import Data.TraversableWithIndex (traverseWithIndex)
import Data.Tuple (Tuple(..))
import Dhall.Parser (skipSpacesAndComments)
import Dhall.Parser as DhallParser
import Dhall.Types (DhallLiteral(..))
import Foreign.Object as Object
import Parsing (ParseError, Parser, fail, runParser)
import Parsing.String (eof)
import Spago.PackagesDhall.PackageSet.Types (PackageSet)

parsePackageSetDhall ∷ String → Either ParseError PackageSet
parsePackageSetDhall = flip runParser do
  skipSpacesAndComments
  rec ← DhallParser.dhallRecordOf (DhallParser.dhallRecord unit)
  res ← traverseWithIndex
    ( \project v → do
        dependencies ← getDeps v
        repo ← getRepo v
        version ← getVersion v
        pure $ Tuple (ProjectName project) { dependencies, repo, version }
    )
    rec
  skipSpacesAndComments
  eof
  pure (Object.values res # Map.fromFoldable)
  where
  getDeps ∷ _ → Parser String (Array ProjectName)
  getDeps obj = do
    case Object.lookup "dependencies" obj of
      Just (DhallArray ds) | Just deps ← traverse getStr ds →
        pure (ProjectName <$> deps)
      _ → fail "No dependencies"
  getRepo obj = do
    case Object.lookup "repo" obj of
      Just (DhallString s) →
        pure $ Repository s
      _ → fail "No repo"
  getVersion obj = do
    case Object.lookup "version" obj of
      Just (DhallString s) →
        pure $ Version s
      _ → fail "No version"
  getStr = case _ of
    DhallString s → Just s
    _ → Nothing
