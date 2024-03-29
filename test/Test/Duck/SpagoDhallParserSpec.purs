module Test.Duck.SpagoDhallParserSpec where

import Prelude

import Biz.Github.Types (Repository(..))
import Biz.Spago.Types (ProjectName(..), SourceGlob(..), Version(..))
import Data.Array (intercalate, zip)
import Data.Either (Either(..))
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Data.String.Utils (lines, padEnd)
import Data.Tuple.Nested ((/\))
import Dhall.Parser (arrayAppendExpr)
import Dhall.Parser as D
import Dhall.Types (DhallLiteral(..), LocalImport(..), RemoteImport(..))
import Dodo (plainText, print, twoSpaces)
import Foreign.Object as Object
import Parsing (runParser)
import Spago.ExtendedSpagoDhall.Parser (parseExtendedSpagoDhall)
import Spago.ExtendedSpagoDhall.Printer (extendedSpagoDhallDoc)
import Spago.ExtendedSpagoDhall.Types (ExtendedSpagoDhall)
import Spago.PackagesDhall.PackageSet.Parser (parsePackageSetDhall)
import Spago.PackagesDhall.PackageSet.Types (PackageSet)
import Spago.PackagesDhall.Parser as PD
import Spago.PackagesDhall.Printer (packagesDhallDoc)
import Spago.PackagesDhall.Types (Change(..), PackagesDhall)
import Spago.SpagoDhall.Parser as P
import Spago.SpagoDhall.Printer (spagoDhallDoc)
import Spago.SpagoDhall.Types (SpagoDhall)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

spec ∷ Spec Unit
spec = describe "The spago.dhall parser" do
  it "Parses a spago.dhall file" do
    P.parseSpagoDhall exampleFile `shouldEqual` Right
      exampleSpagoDhall
  it "Parses a spago.test.dhall file" do
    parseExtendedSpagoDhall exampleExtendedSpagoDhallString `shouldEqual` Right
      exampleExtendedSpagoDhall
  it "Parses a packages.dhall file" do
    PD.parsePackagesDhall examplePackagesDhallString `shouldEqual` Right
      examplePackagesDhall
  it "Parses a package set file" do
    parsePackageSetDhall examplePackageSetString `shouldEqual` Right
      examplePackageSet
  it "Parses an array append expression" do
    runParser "help.me # [ \"rat\", \"boy\"]" arrayAppendExpr `shouldEqual`
      Right
        { variableName: "help.me", array: DhallString <$> [ "rat", "boy" ] }
  it "Parses an empty array" do
    runParser "[] : List Text" (D.dhallArray unit) `shouldEqual` Right []
    runParser "[] : List  Text " (D.dhallArray unit) `shouldEqual` Right []
  -- [TODO] Not sure if this should parse {} or {=}
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
      D.dhallLetInBinding `shouldEqual`
      Right
        ( { name: "x"
          , value: DhallString "help"
          , with: [ { name: "beer", value: DhallBoolean true } ]
          }
        )
  it "Parses another let in expression" do
    runParser "let x = \"help\" in x\n with beer = {}"
      D.dhallLetInBinding `shouldEqual`
      Right
        ( { name: "x"
          , value: DhallString "help"
          , with: [ { name: "beer", value: DhallRecord (Object.empty) } ]
          }
        )
  it "Parses a let in expression with location" do
    runParser
      "let x = \"help\" in x\n with beer = ../something.dhall as Location"
      D.dhallLetInBinding `shouldEqual`
      Right
        ( { name: "x"
          , value: DhallString "help"
          , with:
              [ { name: "beer"
                , value: DhallLocalImport
                    (LocalImport "../something.dhall")
                }
              ]
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
    result `shouldEqual` examplePackagesDhallString
  it "Prints an extended spago.test.dhall" do
    let
      result = print plainText (twoSpaces { pageWidth = 80 })
        (extendedSpagoDhallDoc exampleExtendedSpagoDhall)
    result `shouldEqual` exampleExtendedSpagoDhallString

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
  { leadingComment: Just "\nWelcome to a Spago project!\n"
  , dependencies: ProjectName <$>
      [ "aff"
      , "maff"
      , "kaff"
      , "raff"
      , "yoga-tree"
      , "long-long-long-long-long-long-long-long-long-long"
      ]
  , packages: LocalImport "./packages.dhall"
  , sources: [ SourceGlob "src/**/*.purs" ]
  , name: ProjectName "duck"
  , repository: Nothing
  , license: Nothing
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
                { dependencies: ProjectName <$> [ "edwin", "merkel" ]
                , repo: Repository
                    "https://github.com/i-am-the-slime/purescript-playwright.git"
                , version: Version "b8eb61c28d457cf8a61123106c01a1d8024eb3f8"
                }
            )
        , name: ProjectName "playwright"
        }
      , { change: RepoChange (Repository "haha")
        , name: ProjectName "edwin"
        }
      , { change: VersionChange (Version "v0.0.0.0")
        , name: ProjectName "edwin"
        }
      , { change: DependenciesChange [ ProjectName "merkel" ]
        , name: ProjectName "simple-edwin"
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

exampleExtendedSpagoDhall ∷ ExtendedSpagoDhall
exampleExtendedSpagoDhall =
  { leadingComment: Nothing
  , baseFile: { import: LocalImport "./spago.dhall", name: "conf" }
  , dependencies: ProjectName <$>
      [ "more"
      , "deps"
      , "than"
      , "before-even-break-the-line-please-immediately"
      ]
  , sources: [ SourceGlob "more/code/**/*.purs" ]
  }

exampleExtendedSpagoDhallString ∷ String
exampleExtendedSpagoDhallString =
  """let conf = ./spago.dhall

in  conf //
    { sources = conf.sources # [ "more/code/**/*.purs" ]
    , dependencies =
        conf.dependencies #
          [ "more"
          , "deps"
          , "than"
          , "before-even-break-the-line-please-immediately"
          ]
    }
"""

examplePackageSetString ∷ String
examplePackageSetString =
  """
{ ace =
  { dependencies =
    [ "arrays"
    , "effect"
    , "foreign"
    , "nullable"
    , "prelude"
    , "web-html"
    , "web-uievents"
    ]
  , repo = "https://github.com/purescript-contrib/purescript-ace.git"
  , version = "v9.0.0"
  }
, aff =
  { dependencies =
    [ "datetime"
    , "effect"
    , "exceptions"
    , "functions"
    , "parallel"
    , "transformers"
    , "unsafe-coerce"
    ]
  , repo = "https://github.com/purescript-contrib/purescript-aff.git"
  , version = "v7.0.0"
  }
, no-deps =
  { dependencies = [] : List Text
  , repo =
      "https://github.com/purescript-contrib/purescript-arraybuffer-types.git"
  , version = "v3.0.2"
  }
}
"""

examplePackageSet ∷ PackageSet
examplePackageSet = Map.fromFoldable
  [ ( ProjectName "ace" /\
        { dependencies:
            ProjectName <$>
              [ "arrays"
              , "effect"
              , "foreign"
              , "nullable"
              , "prelude"
              , "web-html"
              , "web-uievents"
              ]
        , repo: Repository
            "https://github.com/purescript-contrib/purescript-ace.git"
        , version: Version "v9.0.0"
        }
    )
  , ( ProjectName "aff" /\
        { dependencies:
            ProjectName <$>
              [ "datetime"
              , "effect"
              , "exceptions"
              , "functions"
              , "parallel"
              , "transformers"
              , "unsafe-coerce"
              ]
        , repo: Repository
            "https://github.com/purescript-contrib/purescript-aff.git"
        , version: Version "v7.0.0"
        }
    )
  , ProjectName "no-deps" /\
      { dependencies: []
      , repo: Repository
          "https://github.com/purescript-contrib/purescript-arraybuffer-types.git"
      , version: Version "v3.0.2"
      }
  ]

printSideBySide ∷ String → String → String
printSideBySide s1 s2 =
  ( ( lines s1 `zip` lines s2
        <#> \(l1 /\ l2) → padEnd 80 l1 <> l2
    ) # intercalate "\n"
  )
