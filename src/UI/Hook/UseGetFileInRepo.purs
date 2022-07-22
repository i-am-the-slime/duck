module UI.Hook.UseGetFileInRepo where

import Yoga.Prelude.View

import Biz.GraphQL (GraphQL(..))
import Data.Time.Duration (Hours(..))
import Foreign (MultipleErrors)
import Network.RemoteData (RemoteData)
import React.Basic.Hooks as React
import UI.Ctx.Types (Ctx)
import UI.GithubLogin.UseGithubGraphQL (UseGithubGraphQL, useGithubGraphQL)
import Yoga.JSON (class ReadForeign)
import Yoga.JSON as JSON

useGetTextFileInRepo ∷
  ∀ hooks.
  Ctx →
  Render hooks (UseGithubGraphQL GetFileInRepoInput hooks)
    ( (RemoteData _ String) /\
        ( { | GetFileInRepoInput } →
          Effect Unit
        )
    )
useGetTextFileInRepo ctx = React.do
  { data: rd ∷ _ _ { | FileInRepoResponse }, send: query } ← useGithubGraphQL
    ctx
    (Just (0.1 # Hours))
    getFileInRepoQuery
  pure ((rd <#> _.data.repository.object.text) /\ query)

type GetFileInRepoInput =
  ( revision_and_file ∷ String
  , name ∷ String
  , owner ∷ String
  )

getFileInRepoQuery ∷ GraphQL
getFileInRepoQuery = GraphQL
  """
query RepoFiles($owner: String!, $name: String!, $revision_and_file:String!) {
  repository(owner: $owner, name: $name) {
    object(expression: $revision_and_file) {
      ... on Blob {
        text
      }
    }
  }
}"""

type FileInRepoResponse =
  (data ∷ { repository ∷ { object ∷ { text ∷ String } } })
