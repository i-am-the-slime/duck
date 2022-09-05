module Test.Duck.SpagoDhallParserSpec where

import Prelude

import Data.Array (intercalate)
import Data.Array as Array
import Data.Either (Either(..))
import Data.String.Utils (lines, padEnd)
import Data.Tuple.Nested ((/\))
import Dhall.Parser as D
import Dhall.Types (DhallLiteral(..), Glob(..), LocalImport(..))
import Dodo (plainText, print, twoSpaces)
import Effect.Class.Console as Console
import Foreign.Object as Object
import Parsing (runParser)
import Spago.SpagoDhall.Parser as P
import Spago.SpagoDhall.Printer (spagoDhallDoc)
import Spago.SpagoDhall.Types (DependencyName(..), SpagoDhall)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

spec ∷ Spec Unit
spec = describe "The spago.dhall parser" do
  it "Parses a spago.dhall file" do
    P.parseSpagoDhall exampleFile `shouldEqual` Right
      exampleSpagoDhall
  it "Parses an empty array" do
    runParser "[]" (D.dhallArray unit) `shouldEqual` Right []
    runParser "[  ]" (D.dhallArray unit) `shouldEqual` Right []
  it "Parses an empty record" do
    runParser "{}" (D.dhallRecord unit) `shouldEqual` Right (Object.empty)
    runParser "{  }" (D.dhallRecord unit) `shouldEqual` Right (Object.empty)
  it "Parses a string array" do
    runParser "[\"ui\", \"oi\"]" (D.dhallArray unit) `shouldEqual` Right
      [ DhallString "ui", DhallString "oi" ]
  it "Parses a bool array" do
    runParser "[ True,\n False]" (D.dhallArray unit) `shouldEqual` Right
      [ DhallBoolean true, DhallBoolean false ]
  it "Parses a record array" do
    runParser "[ { a = \"a\", b=\"b\"}, {} ]" (D.dhallArray unit) `shouldEqual`
      Right
        [ DhallRecord
            (Object.fromHomogeneous { a: DhallString "a", b: DhallString "b" })
        , DhallRecord Object.empty
        ]
  it "Parses an import" do
    runParser "./packages.dhall" D.dhallImport `shouldEqual`
      Right (LocalImport "./packages.dhall")
  it "Parses an import" do
    runParser "./packages.dhall    " D.dhallImport `shouldEqual`
      Right (LocalImport "./packages.dhall")
  it "Prints a spago.dhall" do
    let
      result = print plainText (twoSpaces { pageWidth = 80 })
        (spagoDhallDoc exampleSpagoDhall)
    Console.log
      ( ( lines result `Array.zip` lines expectedPrint
            <#> \(l1 /\ l2) → padEnd 80 l1 <> l2
        )
          # intercalate "\n"
      )
    result `shouldEqual` expectedPrint

expectedPrint ∷ String
expectedPrint =
  """{-
Welcome to a Spago project!
-}
{ name = "duck"
, dependencies =
  [ "aff"
  , "maff"
  , "kaff"
  , "raff"
  , "yoga-tree"
  , "long-long-long-long-long-long-long-long-long-long"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
"""

exampleFile ∷ String
exampleFile =
  """{-
Welcome to a Spago project!
-}
{ name = "duck"
, dependencies =
  [ "aff"
  , "maff"
  , "kaff"
  , "raff"
  , "yoga-tree"
  , "long-long-long-long-long-long-long-long-long-long"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
"""

exampleSpagoDhall ∷ SpagoDhall
exampleSpagoDhall =
  { leadingComment: "\nWelcome to a Spago project!\n"
  , dependencies: DependencyName <$>
      [ "aff"
      , "maff"
      , "kaff"
      , "raff"
      , "yoga-tree"
      , "long-long-long-long-long-long-long-long-long-long"
      ]
  , packages: LocalImport "./packages.dhall"
  , sources: [ Glob "src/**/*.purs" ]
  , name: "duck"
  }
