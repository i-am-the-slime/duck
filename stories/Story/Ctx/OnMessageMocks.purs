module Story.Ctx.OnMessageMocks where

import Prelude

import Backend.Github.API.Types (GithubGraphQLResponse(..), unGithubGraphQLQuery)
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
import UI.Hook.UseGetFileInRepo (FileInRepoResponse)
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
                { text: writeJSON
                    $ Map.union
                        ( Map.fromFoldable
                            [ ( "purescript-framer-motion" /\
                                  "https://github.com/i-am-the-slime/purescript-framer-motion.git"
                              )
                            , ( "purescript-bigints" /\
                                  "https://github.com/purescript-contrib/purescript-bigints.git"
                              )
                            , ( "purescript-extremely-long-name-because-its-good-for-testing"
                                  /\
                                    "https://github.com/purescript-contrib/purescript-bigints.git"
                              )

                            ]
                        )
                    $
                      Map.fromFoldable
                        ( replicate 300
                            ( "purescript-z-fake" /\ "jack"
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
                          ( "purescript-z-fake-bower" /\ "jack"
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

getMockReadme ∷ OnMessage
getMockReadme = case _ of
  QueryGithubGraphQL query
    | unGithubGraphQLQuery query # String.contains
        (String.Pattern "HEAD:README.md") →
        pure $ Just $ GithubGraphQLResult
          ( Succeeded
              ( GithubGraphQLResponse
                  ( writeJSON
                      { data:
                          { repository: { object: { text: exampleReadme } } }
                      }
                  )
              )
          )
  _ → pure Nothing
  where
  exampleReadme =
    """
# Ace

[![CI](https://github.com/purescript-contrib/purescript-ace/workflows/CI/badge.svg?branch=main)](https://github.com/purescript-contrib/purescript-ace/actions?query=workflow%3ACI+branch%3Amain)
[![Release](http://img.shields.io/github/release/purescript-contrib/purescript-ace.svg)](https://github.com/purescript-contrib/purescript-ace/releases)
[![Pursuit](http://pursuit.purescript.org/packages/purescript-ace/badge)](http://pursuit.purescript.org/packages/purescript-ace)
[![Maintainer: garyb](https://img.shields.io/badge/maintainer-garyb-teal.svg)](http://github.com/garyb)

PureScript bindings for the [Ace code editor](http://ace.c9.io).

## Installation

Install `ace` with [Spago](https://github.com/purescript/spago):

```sh
spago install ace
```

You may either include a CDN link in your project's `index.html`, or install the `ace-builds` npm dependency and let a bundler package it in your app. See Ace's [embedding guide](https://ace.c9.io/#nav=embedding) for more information.

### Here's a CDN example:
```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Ace Demo</title>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.min.js" charset="utf-8"></script>
</head>

<body>
  <script src="./index.js"></script>
</body>

</html>
```

### To install via NPM instead:
```
npm install ace-builds
```

Note that you'll probably need the `src-noconflict` path when bundling with Common JS modules (PureScript's current output, until we switch to ES Modules in ~`0.15.0`). For example:
```html
<script src="../node_modules/ace-builds/src-noconflict/ace.js"></script>
```

## Quick start

The quick start hasn't been written yet (contributions are welcome!). The quick start covers a common, minimal use case for the library, whereas longer examples and tutorials are kept in the [docs directory](./docs).

## Documentation

`ace` documentation is stored in a few places:

1. Module documentation is [published on Pursuit](https://pursuit.purescript.org/packages/purescript-ace).
2. Written documentation is kept in [the docs directory](./docs).
3. The [examples directory](./examples) demonstrates how to embed the Ace editor and configure it via the PureScript API.

If you get stuck, there are several ways to get help:

- [Open an issue](https://github.com/purescript-contrib/purescript-ace/issues) if you have encountered a bug or problem.
- Ask general questions on the [PureScript Discourse](https://discourse.purescript.org) forum or the [PureScript Discord](https://purescript.org/chat) chat.

## Contributing

You can contribute to `ace` in several ways:

1. If you encounter a problem or have a question, please [open an issue](https://github.com/purescript-contrib/purescript-ace/issues). We'll do our best to work with you to resolve or answer it.

2. If you would like to contribute code, tests, or documentation, please [read the contributor guide](./CONTRIBUTING.md). It's a short, helpful introduction to contributing to this library, including development instructions.

3. If you have written a library, tutorial, guide, or other resource based on this package, please share it on the [PureScript Discourse](https://discourse.purescript.org)! Writing libraries and learning resources are a great way to help this library succeed.
"""