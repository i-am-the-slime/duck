module UI.Hook.UseGetTopLevelFilesInRepo where

import Yoga.Prelude.View

import Biz.GraphQL (GraphQL(..))
import Foreign (MultipleErrors)
import Network.RemoteData (RemoteData)
import React.Basic.Hooks as React
import UI.Ctx.Types (Ctx)
import UI.GithubLogin.UseGithubGraphQL (UseGithubGraphQL, useGithubGraphQL)

useGetTopLevelFilesInRepo ∷
  ∀ hooks.
  Ctx →
  Render hooks (UseGithubGraphQL hooks)
    ( (RemoteData MultipleErrors (Array GithubFileInfo)) /\
        ( { | GetTopLevelFilesInRepoInput } →
          Effect Unit
        )
    )
useGetTopLevelFilesInRepo ctx = React.do
  (rd ∷ _ _ { | TopLevelFilesInRepoResponse }) /\ query ←
    useGithubGraphQL ctx getGetTopLevelFilesInRepoQuery
  pure ((rd <#> _.data.repository.object.entries) /\ query)

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