module UI.Github.Repo.Biz.UseGetGithubRepoInfo where

import Yoga.Prelude.View

import Biz.GraphQL (GraphQL(..))
import Data.Array as Array
import Data.Array.Extra (chunked)
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NEA
import Data.Interpolate as Interpolate
import Data.JSDate (JSDate)
import Data.JSDate as JSDate
import Data.List as List
import Data.Map (Map)
import Data.Map as Map
import Data.Newtype (class Newtype)
import Effect.Class.Console as Console
import Effect.Unsafe (unsafePerformEffect)
import Foreign (MultipleErrors)
import Network.RemoteData (RemoteData(..))
import Network.RemoteData as RD
import React.Basic.Hooks as React
import UI.Ctx.Types (Ctx)
import UI.FilePath (GithubRepo)
import UI.GithubLogin.UseGithubGraphQL (UseGithubGraphQL, useDynamicGithubGraphQL)

type Entry =
  { name ∷ String
  , owner ∷ { login ∷ String }
  , defaultBranchRef ∷
      { name ∷ String
      , target ∷
          { history ∷ { edges ∷ Array { node ∷ { pushedDate ∷ Maybe String } } }
          }
      }
  }

type Result =
  (Map GithubRepo (RemoteData String RepoInfo)) /\
    (Array GithubRepo → Effect Unit)

derive instance Newtype (UseGetGithubRepoInfo hooks) _

useGetGithubRepoInfo ∷ Ctx → Hook UseGetGithubRepoInfo Result
useGetGithubRepoInfo (ctx ∷ Ctx) = coerceHook React.do
  rd /\ get ← useDynamicGithubGraphQL ctx
  remainingChunks /\ setRemainingChunks ← React.useState
    ([] ∷ (Array (NonEmptyArray GithubRepo)))
  results /\ setResults ← React.useState
    (Map.empty ∷ _ GithubRepo (RemoteData String RepoInfo))
  resultsRef ← React.useRef
    (Map.empty ∷ _ GithubRepo (RemoteData String RepoInfo))
  useEffect remainingChunks do
    chunkResults ← React.readRef resultsRef
    setResults (Map.union chunkResults)
    case Array.head remainingChunks of
      Nothing → mempty
      Just chunk → do
        setResults
          (Map.union (chunk <#> (_ /\ Loading) # Map.fromFoldable))
        get (mkGetRepoInfo chunk) {}
    -- [TODO] set results
    mempty

  useEffect rd do
    case rd of
      RD.NotAsked → do
        React.writeRef resultsRef Map.empty
      RD.Loading → mempty
      RD.Failure e → do
        Console.log (show e)
        mempty
      RD.Success (repoInfoResult ∷ { | RepoInfoResult }) → do
        intermediate ← React.readRef resultsRef
        React.writeRef resultsRef
          ( intermediate # Map.union
              ( ( repoInfoResult.data # Map.values
                    # List.mapMaybe
                        ( map \x@{ owner: { login: owner }, name: repoName } →
                            { owner, repoName }
                              /\
                                ( x.defaultBranchRef.target.history.edges
                                    # Array.head
                                    >>= _.node.pushedDate
                                    <#>
                                      ( \s →
                                          { lastCommit: unsafePerformEffect
                                              (JSDate.parse s)
                                          , defaultBranch:
                                              x.defaultBranchRef.name
                                          }
                                      )
                                    # note "null result from API"
                                    # RD.fromEither
                                )
                        )
                )
                  # Map.fromFoldable
              )
          )
        setRemainingChunks (Array.tail >>> fromMaybe [])
    mempty
  let
    result ∷
      (Map GithubRepo (RemoteData String RepoInfo)) /\
        (Array GithubRepo → Effect Unit)
    result =
      results /\ \repos → do
        let
          chunks =
            ( [ Array.take 8 repos, Array.slice 8 20 repos ] # Array.mapMaybe
                NEA.fromArray
            ) <> chunked 80
              (Array.drop 20 repos)
        setResults $ const $ Map.fromFoldable $ repos <#> (_ /\ NotAsked)
        setRemainingChunks (const (chunks))

  pure result

type RepoInfo = { defaultBranch ∷ String, lastCommit ∷ JSDate }
type RepoInfoResult = (data ∷ (Map String (Maybe Entry)))

mkGetRepoInfo ∷ NonEmptyArray GithubRepo → GraphQL
mkGetRepoInfo repos = GraphQL $
  Interpolate.i fragment "\n{\n" inputs "\n}"
  where
  inputs ∷ String
  inputs = repos # foldMapWithIndex toRepoQuery

  toRepoQuery index { owner, repoName: repo } = do
    Interpolate.i "repo" index ":" "repository" "(owner:" (quote owner)
      ", name: "
      (quote repo)
      ") "
      "{ ...repoProperties }\n"

  fragment =
    """
    fragment repoProperties on Repository {
        name
        owner { login }
        defaultBranchRef {
          name
          target {
            ... on Commit {
              history(first: 1) {
                edges {
                  node {
                    pushedDate
                  }
                }
              }
            }
          }
        }
      }
    """

  quote ∷ String → String
  quote = show

newtype UseGetGithubRepoInfo hooks = UseGetGithubRepoInfo
  ( UseEffect
      ( RemoteData MultipleErrors
          { data ∷ Map String (Maybe Entry)
          }
      )
      ( UseEffect
          ( Array (NonEmptyArray (GithubRepo))
          )
          ( UseRef
              ( Map
                  { owner ∷ String
                  , repoName ∷ String
                  }
                  ( RemoteData String
                      { defaultBranch ∷ String
                      , lastCommit ∷ JSDate
                      }
                  )
              )
              ( UseState
                  ( Map
                      { owner ∷ String
                      , repoName ∷ String
                      }
                      ( RemoteData String
                          { defaultBranch ∷ String
                          , lastCommit ∷ JSDate
                          }
                      )
                  )
                  ( UseState
                      ( Array
                          ( NonEmptyArray
                              { owner ∷ String
                              , repoName ∷ String
                              }
                          )
                      )
                      (UseGithubGraphQL hooks)
                  )
              )
          )
      )
  )