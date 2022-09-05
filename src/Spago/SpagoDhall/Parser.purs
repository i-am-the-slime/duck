module Spago.SpagoDhall.Parser where

import Data.Either (Either)
import Data.Maybe (maybe)
import Data.Traversable (traverse)
import Dhall.Parser as DhallParser
import Dhall.Types (DhallLiteral(..), LocalImport, Glob(..))
import Foreign.Object (Object)
import Foreign.Object as Object
import Parsing (ParseError, Parser, fail, runParser)
import Parsing.String (eof)
import Prelude (bind, discard, pure, unit, (#), ($), (>>>))
import Spago.SpagoDhall.Types (DependencyName(..), SpagoDhall)

parseSpagoDhall ∷ String → Either ParseError SpagoDhall
parseSpagoDhall s = runParser s do
  leadingComment ← DhallParser.multiLineComment
  DhallParser.skipSpacesAndComments
  rec ← DhallParser.dhallRecord unit
  dependencies ← getDependencies rec
  packages ← getPackages rec
  sources ← getSources rec
  name ← getName rec
  eof
  pure $
    { leadingComment
    , dependencies
    , packages
    , sources
    , name
    }

getDependencies ∷ Object DhallLiteral → Parser String (Array DependencyName)
getDependencies = Object.lookup "dependencies" >>> maybe
  (fail "Couldn't find dependencies in dhall file")
  case _ of
    DhallArray arr → arr # traverse case _ of
      DhallString str → pure (DependencyName str)
      _ → fail "All dependencies must be strings"
    _ → fail $ "Dependencies can only be an array of strings."

getPackages ∷ Object DhallLiteral → Parser String LocalImport
getPackages = Object.lookup "packages" >>> maybe
  (fail "Couldn't find packages in dhall file")
  case _ of
    DhallLocalImport imp → pure imp
    _ → fail $ "Packages can only be a simple local import"

getName ∷ Object DhallLiteral → Parser String String
getName = Object.lookup "name" >>> maybe
  (fail "Couldn't find name in dhall file")
  case _ of
    DhallString name → pure name
    _ → fail $ "Packages can only be a simple local import"

getSources ∷ Object DhallLiteral → Parser String (Array Glob)
getSources = Object.lookup "sources" >>> maybe
  (fail "Couldn't find sources in dhall file")
  case _ of
    DhallArray arr → arr # traverse case _ of
      DhallString str → pure (Glob str)
      _ → fail "All sources must be strings"
    _ → fail $ "Sources can only be an array of strings."
