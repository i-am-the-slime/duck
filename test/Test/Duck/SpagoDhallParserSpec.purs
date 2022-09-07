module Test.Duck.SpagoDhallParserSpec where

import Prelude

import Biz.Github.Types (Repository(..))
import Biz.Spago.Types (Version(..))
import Data.Array (intercalate, zip)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.String.Utils (lines, padEnd)
import Data.Tuple.Nested ((/\))
import Dhall.Parser as D
import Dhall.Types (DhallLiteral(..), Glob(..), LocalImport(..), RemoteImport(..))
import Dodo (plainText, print, twoSpaces)
import Effect.Class.Console as Console
import Foreign.Object as Object
import Parsing (runParser)
import Spago.PackagesDhall.Parser as PD
import Spago.PackagesDhall.Printer (packagesDhallDoc)
import Spago.PackagesDhall.Types (Change(..), PackagesDhall)
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
  it "Parses a packages.dhall file" do
    PD.parsePackagesDhall examplePackagesDhallString `shouldEqual` Right
      examplePackagesDhall
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
  it "Parses a local import" do
    runParser "./packages.dhall" D.dhallLocalImport `shouldEqual`
      Right (LocalImport "./packages.dhall")
  it "Parses a local import" do
    runParser "./packages.dhall    " D.dhallLocalImport `shouldEqual`
      Right (LocalImport "./packages.dhall")
  it "Parses a remote import" do
    runParser
      "https://github.com/purescript/package-sets/releases/download/psc-0.15.4-20220725/packages.dhall\n      sha256:e56fbdf33a5afd2a610c81f8b940b413a638931edb41532164e641bb2a9ec29c"
      D.dhallRemoteImport `shouldEqual`
      Right
        ( RemoteImport
            { hash: Just
                "sha256:e56fbdf33a5afd2a610c81f8b940b413a638931edb41532164e641bb2a9ec29c"
            , url:
                "https://github.com/purescript/package-sets/releases/download/psc-0.15.4-20220725/packages.dhall"
            }
        )
  it "Parses a let in expression" do
    runParser "let x = \"help\" in x\n with beer = True"
      (D.dhallLetInBinding unit) `shouldEqual`
      Right
        ( { name: "x"
          , value: DhallString "help"
          , with: [ { name: "beer", value: DhallBoolean true } ]
          }
        )
  it "Parses another let in expression" do
    runParser "let x = \"help\" in x\n with beer = {}"
      (D.dhallLetInBinding unit) `shouldEqual`
      Right
        ( { name: "x"
          , value: DhallString "help"
          , with: [ { name: "beer", value: DhallRecord (Object.empty) } ]
          }
        )
  it "Prints a spago.dhall" do
    let
      result = print plainText (twoSpaces { pageWidth = 80 })
        (spagoDhallDoc exampleSpagoDhall)
    result `shouldEqual` expectedPrint
  it "Prints a packages.dhall" do
    let
      result = print plainText (twoSpaces { pageWidth = 80 })
        (packagesDhallDoc examplePackagesDhall)
    Console.log (printSideBySide result examplePackagesDhallString)
    result `shouldEqual` examplePackagesDhallString

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

examplePackagesDhallString ∷ String
examplePackagesDhallString =
  """{- Gurke
-}
let upstream =
      https://github.com/purescript/package-sets/releases/download/psc-0.15.4-20220725/packages.dhall
        sha256:e56fbdf33a5afd2a610c81f8b940b413a638931edb41532164e641bb2a9ec29c

in  upstream
  with playwright =
    { repo = "https://github.com/i-am-the-slime/purescript-playwright.git"
    , version = "b8eb61c28d457cf8a61123106c01a1d8024eb3f8"
    , dependencies = [ "edwin", "merkel" ]
    }
  with edwin.repo = "haha"
  with edwin.version = "v0.0.0.0"
  with simple-edwin.dependencies = [ "merkel" ]
"""

examplePackagesDhall ∷ PackagesDhall
examplePackagesDhall =
  { changes:
      [ { change:
            ( CompleteChange
                { dependencies: DependencyName <$> [ "edwin", "merkel" ]
                , repo: Repository
                    "https://github.com/i-am-the-slime/purescript-playwright.git"
                , version: Version "b8eb61c28d457cf8a61123106c01a1d8024eb3f8"
                }
            )
        , name: DependencyName "playwright"
        }
      , { change: RepoChange (Repository "haha")
        , name: DependencyName "edwin"
        }
      , { change: VersionChange (Version "v0.0.0.0")
        , name: DependencyName "edwin"
        }
      , { change: DependenciesChange [ DependencyName "merkel" ]
        , name: DependencyName "simple-edwin"
        }
      ]
  , leadingComment: " Gurke\n"
  , packageSet:
      { link:
          "https://github.com/purescript/package-sets/releases/download/psc-0.15.4-20220725/packages.dhall"
      , sha:
          ( Just
              "sha256:e56fbdf33a5afd2a610c81f8b940b413a638931edb41532164e641bb2a9ec29c"
          )
      }
  }

printSideBySide ∷ String → String → String
printSideBySide s1 s2 =
  ( ( lines s1 `zip` lines s2
        <#> \(l1 /\ l2) → padEnd 80 l1 <> l2
    ) # intercalate "\n"
  )
