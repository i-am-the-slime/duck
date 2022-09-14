module Spago.ExtendedSpagoDhall.Parser where

import Prelude

import Biz.Spago.Types (ProjectName(..), SourceGlob(..))
import Data.Either (Either)
import Data.Maybe (maybe)
import Data.String.Utils (endsWith)
import Data.Traversable (traverse)
import Debug (spy)
import Dhall.Parser (skipSpacesAndComments)
import Dhall.Parser as DhallParser
import Dhall.Types (DhallLiteral(..))
import Foreign.Object (Object)
import Foreign.Object as Object
import Parsing (ParseError, Parser, fail, runParser)
import Parsing.Combinators (optionMaybe, try)
import Parsing.String (eof, string)
import Spago.ExtendedSpagoDhall.Types (ExtendedSpagoDhall)

parseExtendedSpagoDhall ∷ String → Either ParseError ExtendedSpagoDhall
parseExtendedSpagoDhall s = runParser s do
  leadingComment ← optionMaybe $ try $ DhallParser.multiLineComment
  let _ = spy "parsed leading comment" leadingComment
  DhallParser.skipSpacesAndComments
  { name, import', mergedRec } ← DhallParser.dhallLetInBindingOf
    \{ name, value } → do
      let _ = spy "parsed inner" { name, value }
      import' ← case value of
        DhallLocalImport i → do
          let _ = spy "parsed import" i
          pure i
        _ → fail "Base file must be a local import"
      void $ string name
      skipSpacesAndComments
      mergedRec ← DhallParser.recordMergeExpr
      let _ = spy "parsed mergedRec" mergedRec
      pure { name, import', mergedRec }
  dependencies ← getDependencies mergedRec
  sources ← getSources mergedRec
  DhallParser.skipSpacesAndComments
  eof
  pure $
    { leadingComment
    , baseFile: { name, import: import' }
    , dependencies
    , sources
    }

getDependencies ∷
  Object
    { array ∷ Array DhallLiteral
    , variableName ∷ String
    } →
  Parser String (Array ProjectName)
getDependencies = Object.lookup "dependencies" >>> maybe
  (fail "Couldn't find dependencies in dhall file")
  \{ array, variableName } → case array of
    arr | variableName # endsWith ".dependencies" →
      arr # traverse case _ of
        DhallString str → pure (ProjectName str)
        _ → fail "All dependencies must be strings"
    _ → fail $
      "Dependencies can only be an array of strings that extends dependencies of the base file."

getSources ∷
  Object
    { array ∷ Array DhallLiteral
    , variableName ∷ String
    } →
  Parser String (Array SourceGlob)
getSources = Object.lookup "sources" >>> maybe
  (fail "Couldn't find sources in dhall file")
  \{ array, variableName } → case array of
    arr | variableName # endsWith ".sources" →
      arr # traverse case _ of
        DhallString str → pure (SourceGlob str)
        _ → fail "All sources must be strings"
    _ → fail $
      "Sources can only be an array of strings that extends sources of the base file."
