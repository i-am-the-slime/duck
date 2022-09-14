module Spago.SpagoDhall.Parser where

import Prelude

import Biz.Github.Types (Repository(..))
import Biz.Spago.Types (ProjectName(..), SourceGlob(..))
import Data.Either (Either)
import Data.Maybe (Maybe(..), maybe)
import Data.Traversable (traverse)
import Dhall.Parser as DhallParser
import Dhall.Types (DhallLiteral(..), LocalImport)
import Foreign.Object (Object)
import Foreign.Object as Object
import Parsing (ParseError, Parser, fail, runParser)
import Parsing.Combinators (optionMaybe)
import Parsing.String (eof)
import Spago.SpagoDhall.Types (SpagoDhall)

parseSpagoDhall ∷ String → Either ParseError SpagoDhall
parseSpagoDhall s = runParser s do
  leadingComment ← optionMaybe $ DhallParser.multiLineComment
  DhallParser.skipSpacesAndComments
  rec ← DhallParser.dhallRecord unit
  dependencies ← getDependencies rec
  packages ← getPackages rec
  sources ← getSources rec
  name ← getName rec
  repository ← getRepository rec
  license ← getLicense rec
  DhallParser.skipSpacesAndComments
  eof
  pure $
    { leadingComment
    , dependencies
    , packages
    , sources
    , name
    , repository
    , license
    }

getDependencies ∷ Object DhallLiteral → Parser String (Array ProjectName)
getDependencies = Object.lookup "dependencies" >>> maybe
  (fail "Couldn't find dependencies in dhall file")
  case _ of
    DhallArray arr → arr # traverse case _ of
      DhallString str → pure (ProjectName str)
      _ → fail "All dependencies must be strings"
    _ → fail $ "Dependencies can only be an array of strings."

getLicense ∷ Object DhallLiteral → Parser String (Maybe String)
getLicense = Object.lookup "license" >>> maybe
  (pure Nothing)
  case _ of
    DhallString str → pure (Just str)
    _ → fail "License must be a string"

getPackages ∷ Object DhallLiteral → Parser String LocalImport
getPackages = Object.lookup "packages" >>> maybe
  (fail "Couldn't find packages in dhall file")
  case _ of
    DhallLocalImport imp → pure imp
    _ → fail $ "Packages can only be a simple local import"

getName ∷ Object DhallLiteral → Parser String ProjectName
getName = Object.lookup "name" >>> maybe
  (fail "Couldn't find name in dhall file")
  case _ of
    DhallString name → pure $ ProjectName name
    _ → fail $ "Packages can only be a simple local import"

getRepository ∷ Object DhallLiteral → Parser String (Maybe Repository)
getRepository x = case Object.lookup "repository" x of
  Nothing → pure Nothing
  Just (DhallString name) → pure $ Just (Repository name)
  _ → fail $ "Packages can only be a simple local import"

getSources ∷ Object DhallLiteral → Parser String (Array SourceGlob)
getSources = Object.lookup "sources" >>> maybe
  (fail "Couldn't find sources in dhall file")
  case _ of
    DhallArray arr → arr # traverse case _ of
      DhallString str → pure (SourceGlob str)
      _ → fail "All sources must be strings"
    _ → fail $ "Sources can only be an array of strings."
