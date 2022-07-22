module UI.Hook.UseGetTopLevelFilesInRepo where

import Yoga.Prelude.View

import Biz.GraphQL (GraphQL(..))
import Data.Time.Duration (Hours(..))
import Foreign (MultipleErrors)
import Network.RemoteData (RemoteData)
import React.Basic.Hooks as React
import UI.Ctx.Types (Ctx)
import UI.GithubLogin.UseGithubGraphQL (UseGithubGraphQL, useGithubGraphQL)

useGetTopLevelFilesInRepo ∷
  ∀ hooks.
  Ctx →
  Render hooks (UseGithubGraphQL GetTopLevelFilesInRepoInput hooks)
    { data ∷ RemoteData MultipleErrors (Array GithubFileInfo)
    , send ∷ { | GetTopLevelFilesInRepoInput } → Effect Unit
    }
useGetTopLevelFilesInRepo ctx = React.do
  { data: rd ∷ _ _ { | TopLevelFilesInRepoResponse }, send: query } ←
    useGithubGraphQL ctx (Just (0.5 # Hours)) getGetTopLevelFilesInRepoQuery
  pure { data: rd <#> _.data.repository.object.entries, send: query }

type GetTopLevelFilesInRepoInput =
  ( owner ∷ String
  , name ∷ String
  )

getGetTopLevelFilesInRepoQuery ∷ GraphQL
getGetTopLevelFilesInRepoQuery = GraphQL
  """query RepoFiles($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          object(expression: "HEAD:") {
            ... on Tree {
              entries {
                name
                type

                object {
                  ... on Blob {
                    byteSize
                    isBinary
                  }
                }
              }
            }
          }
        }
      }
      """

type TopLevelFilesInRepoResponse =
  (data ∷ { repository ∷ { object ∷ { entries ∷ Array GithubFileInfo } } })

type GithubFileInfo =
  { name ∷ String
  , type ∷ String
  , object ∷
      { byteSize ∷ Maybe Number
      , isBinary ∷ Maybe Boolean
      -- , text ∷ String
      }
  }
