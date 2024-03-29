module Test.Duck.ProjectFileSpec where

import Prelude

import Backend.PureScriptSolution (resolveSolutionDefinition)
import Biz.PureScriptSolutionDefinition.Types (EntryPointType(..), PureScriptProjectDefinition(..), PureScriptSolutionDefinition)
import Data.Array as Array
import Data.Bifunctor (lmap)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Yoga.JSON (readJSON)
import Yoga.JSON.Error (renderHumanError)

spec ∷ Spec Unit
spec = describe "The .purescript-project.json file" do
  it "Can be parsed" do
    (readJSON exampleFile # lmap (map renderHumanError)) `shouldEqual`
      Right exampleProject
  it "Can be turned into a project" do
    definition ← resolveSolutionDefinition "." exampleProject
    Array.length definition.projects `shouldEqual` 1

exampleProject ∷ PureScriptSolutionDefinition
exampleProject =
  { name: "some-project"
  , projects:
      [ SpagoApp
          { entrypoints:
              [ { type: Test
                , build_command: Nothing
                , spago_file: "spago.dhall"
                }
              ]
          , root: "."
          }
      ]
  }

exampleFile ∷ String
exampleFile =
  """{
  "name": "some-project",
  "projects": [{
    "type": "spago-app",
    "definition": {
        "root": ".",
        "entrypoints": [{ "type": "test", "spago_file": "spago.dhall" }]
      }
    }]
  }
  """
