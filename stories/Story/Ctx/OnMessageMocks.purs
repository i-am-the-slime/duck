module Story.Ctx.OnMessageMocks where

import Prelude

import Backend.Github.API.Types (GithubGraphQLQuery, GithubGraphQLResponse(..), unGithubGraphQLQuery)
import Backend.Tool.Types (Tool(..), ToolPath(..))
import Biz.IPC.GetInstalledTools.Types (GetInstalledToolsResult(..))
import Biz.IPC.Message.Types (FailedOr(..), MessageToMain(..), MessageToRenderer(..))
import Biz.PureScriptSolutionDefinition.Types (EntryPointType(..), PureScriptProjectDefinition(..), PureScriptSolutionDefinition)
import Data.Array (mapWithIndex, replicate)
import Data.Enum (enumFromTo)
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Data.String as String
import Data.Tuple.Nested ((/\))
import Story.Ctx.Types (OnMessage)
import UI.Registry (FileInRepoResponse)
import Yoga.JSON (writeJSON)

getMockSolutionDefinition ∷ OnMessage
getMockSolutionDefinition = case _ of
  GetPureScriptSolutionDefinitions → do
    pure $ Just $
      ( GetPureScriptSolutionDefinitionsResponse
          [ "/Users/mark/code/spago-viz" /\ exampleProject ]
      )
  _ → pure Nothing
  where
  exampleProject ∷ PureScriptSolutionDefinition
  exampleProject =
    { name: "some-project"
    , projects:
        [ ( SpagoApp
              { entrypoints:
                  [ { type: Test
                    , build_command: Nothing
                    , spago_file: "spago.dhall"
                    }
                  ]
              , root: "."
              }
          )
        ]
    }

getMockInstalledTools ∷ OnMessage
getMockInstalledTools = case _ of
  GetInstalledTools → pure $ Just $ GetInstalledToolsResponse $
    ToolsResult
      ( enumFromTo bottom top <#> \tool → tool /\ case tool of
          NPM → Just (ToolPath "/opt/homebrew/bin/npm")
          Spago → Just (ToolPath "/Users/mark/.local/bin/spago")
          Purs → Just (ToolPath "/Users/mark/.local/bin/purs")
          DhallToJSON → Nothing
      )
  _ → pure Nothing

getMockIsLoggedIntoGithub ∷ OnMessage
getMockIsLoggedIntoGithub = case _ of
  GetIsLoggedIntoGithub → pure $ Just $ GetIsLoggedIntoGithubResult true
  _ → pure Nothing

getMockGithubUserQuery ∷ OnMessage
getMockGithubUserQuery = case _ of
  QueryGithubGraphQL query → do
    let q = unGithubGraphQLQuery query
    pure case q of
      """{"variables":{},"query":"query { viewer { login } }"}""" →
        Just
          ( GithubGraphQLResult $ Succeeded $ GithubGraphQLResponse
              """{ "data": { "viewer": { "login": "rowtype-yoga" } } }"""
          )
      _ → Nothing
  _ → pure Nothing

getMockRegistry ∷ OnMessage
getMockRegistry = case _ of
  QueryGithubGraphQL query
    | unGithubGraphQLQuery query # String.contains
        (String.Pattern "new-packages.json") →
        pure $ Just $ GithubGraphQLResult
          ( Succeeded (GithubGraphQLResponse (writeJSON exampleRepos))
          )
  QueryGithubGraphQL query
    | unGithubGraphQLQuery query # String.contains
        (String.Pattern "bower-packages.json") →
        pure $ Just $ GithubGraphQLResult
          ( Succeeded (GithubGraphQLResponse (writeJSON exampleRepos2))
          )
  _ → pure Nothing
  where
  exampleRepos ∷ { | FileInRepoResponse }
  exampleRepos =
    { data:
        { repository:
            { object:
                { text: writeJSON $
                    Map.fromFoldable
                      ( replicate 300
                          ( "purescript-beer" /\ "agx0o"
                          ) # mapWithIndex \i (name /\ user) →
                          ( (name <> "-" <> show i) /\
                              ( "https://github.com/"
                                  <> (user <> show i)
                                  <> "/purescript-beer.git"
                              )
                          )
                      )
                }
            }
        }
    }

  exampleRepos2 ∷ { | FileInRepoResponse }
  exampleRepos2 =
    { data:
        { repository:
            { object:
                { text: writeJSON $
                    Map.fromFoldable
                      ( replicate 100
                          ( "purescript-bower" /\ "agx0o"
                          ) # mapWithIndex \i (name /\ user) →
                          ( (name <> "-" <> show i) /\
                              ( "https://github.com/"
                                  <> (user <> show i)
                                  <> "/purescript-beer.git"
                              )
                          )
                      )
                }
            }
        }
    }