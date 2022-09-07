module Dhall.Parser where

import Data.Array as Array
import Data.List as List
import Data.String (trim)
import Data.String.CodeUnits as SCU
import Data.String.Utils (endsWith)
import Data.Tuple.Nested ((/\))
import Dhall.Types (DhallLiteral(..), LetInBinding, LocalImport(..), RemoteImport(..))
import Foreign.Object (Object)
import Foreign.Object as Object
import Parsing (Parser, fail)
import Parsing.Combinators (between, many, manyTill, notFollowedBy, optionMaybe, sepBy, try, (<|>))
import Parsing.String (anyChar, char, string)
import Parsing.String.Basic (skipSpaces, whiteSpace)
import Parsing.Token (noneOf, oneOf)
import Prelude (Unit, bind, discard, pure, unit, void, ($), ($>), (*>), (<#>), (<$>), (<>), (>>>))

commentParser ∷ Parser String String
commentParser =
  multiLineComment

skipSpacesAndComments ∷ Parser String Unit
skipSpacesAndComments = skipSpaces
  <|> try (void oneLineComment)
  <|> try (void multiLineComment)
  <|> void (many (oneOf [ ' ', '\n' ]))

oneLineComment ∷ Parser String String
oneLineComment =
  try (string "--") *> (stringUntil (char '\n'))

multiLineComment ∷ Parser String String
multiLineComment = do
  _ ← string "{-"
  stringUntil (string "-}")

dhallLiteral ∷ Unit → Parser String DhallLiteral
dhallLiteral _ = do
  dhallString
    <|> dhallBoolean
    <|> (DhallLocalImport <$> dhallLocalImport)
    <|> (DhallRemoteImport <$> dhallRemoteImport)
    <|> (DhallArray <$> dhallArray unit)
    <|> (DhallRecord <$> dhallRecord unit)

dhallArray ∷ Unit → Parser String (Array DhallLiteral)
dhallArray _ = try emptyArray <|> nonEmptyArray
  where
  emptyArray = do
    _ ← (char '[')
    _ ← skipSpacesAndComments
    _ ← (char ']')
    pure []
  nonEmptyArray = List.toUnfoldable <$>
    between (char '[') (char ']') (nested `sepBy` (char ','))
  nested = do
    skipSpacesAndComments
    value ← (dhallString <|> dhallBoolean <|> DhallRecord <$> dhallRecord unit)
    skipSpacesAndComments
    pure $ value

dhallString ∷ Parser String DhallLiteral
dhallString = void (char '\"') *> stringUntil (char '\"') <#>
  DhallString

dhallBoolean ∷ Parser String DhallLiteral
dhallBoolean =
  string "True"
    $> (DhallBoolean true)
    <|> string "False"
      $> (DhallBoolean false)

dhallLocalImport ∷ Parser String LocalImport
dhallLocalImport = LocalImport <$> do
  start ← string "./" <|> string "~/" <|> string "/"
  str ← many (noneOf [ ' ', '\n' ]) <#>
    (List.toUnfoldable >>> SCU.fromCharArray)
  if (endsWith ".dhall" str) then
    pure (start <> str)
  else fail "Imports must end in .dhall"

dhallRemoteImport ∷ Parser String RemoteImport
dhallRemoteImport = RemoteImport <$> do
  protocol ← string "http://" <|> string "https://"
  str ← Array.many (noneOf [ ' ', '\n' ]) <#> SCU.fromCharArray
  url ←
    if (endsWith ".dhall" str) then
      pure (protocol <> str)
    else fail "Imports must end in .dhall"
  skipSpacesAndComments
  hash ← optionMaybe do
    hashType ← string "sha256:"
    hash ← Array.many (noneOf [ ' ', '\n' ]) <#> SCU.fromCharArray
    pure (hashType <> hash)
  pure { url, hash }

dhallRecord ∷ Unit → Parser String (Object DhallLiteral)
dhallRecord _ = try emptyRecord <|> try nonEmptyRecord
  where
  emptyRecord = do
    _ ← (char '{' *> notFollowedBy (char '-'))
    _ ← skipSpacesAndComments
    _ ← (char '}')
    pure Object.empty
  nonEmptyRecord = Object.fromFoldable <$> between
    (char '{' *> notFollowedBy (char '-'))
    (char '}')
    (keyValue `sepBy` (char ','))
  keyValue = do
    skipSpacesAndComments
    key ← stringUntil (char '=') <#> trim
    skipSpacesAndComments
    value ← dhallLiteral unit
    skipSpacesAndComments
    pure (key /\ value)

dhallLetInBinding ∷ Unit → Parser String LetInBinding
dhallLetInBinding _ = do
  void $ string "let"
  void whiteSpace
  name ← stringUntil (char '=') <#> trim
  skipSpacesAndComments
  value ← dhallLiteral unit
  skipSpacesAndComments
  _ ← string "in"
  void whiteSpace
  skipSpacesAndComments
  void $ string name
  with ← Array.many (try $ skipSpacesAndComments *> withExpr)
  pure { name, value, with }

withExpr ∷ Parser String { name ∷ String, value ∷ DhallLiteral }
withExpr = do
  void $ string "with"
  void whiteSpace
  name ← stringUntil (char '=') <#> trim
  skipSpacesAndComments
  value ← dhallLiteral unit
  pure { name, value }

-- Helpers
stringUntil ∷ ∀ a. Parser String a → Parser String String
stringUntil til =
  manyTill anyChar til <#>
    (List.toUnfoldable >>> SCU.fromCharArray)
