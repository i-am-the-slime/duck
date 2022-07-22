module UI.GithubLogin.UseGithubUserInfo where

import Yoga.Prelude.View

import Backend.Github.API.Types (GithubGraphQLResponse(..), githubGraphQLQuery)
import Biz.GraphQL (GraphQL(..), graphQLQuery)
import Biz.IPC.Message.Types (FailedOr(..), MessageToMain(..), MessageToRenderer(..), NoGithubToken(..))
import Network.RemoteData as RD
import Partial.Unsafe (unsafePartial)
import React.Basic.Hooks as React
import UI.Ctx.Types (Ctx)
import UI.Hook.UseIPCMessage (UseIPCMessage, useIPCMessage)

useGithubUserInfo ∷ Ctx → Hook UseIPCMessage ((Maybe String) /\ (Effect Unit))
useGithubUserInfo ctx = React.do
  { data: res, send } ← useIPCMessage ctx
  let
    result = unsafePartial case res # RD.toMaybe of
      Nothing → Nothing
      Just (GithubGraphQLResult (Succeeded (GithubGraphQLResponse s))) →
        Just s
      Just (GithubGraphQLResult (Failed NoGithubToken)) → Nothing

  let
    get = send $ QueryGithubGraphQL
      (githubGraphQLQuery (graphQLQuery query {}))
  pure $ result /\ get

query ∷ GraphQL
query = GraphQL
  """
query {
  viewer {
    login
    name
    interactionAbility {
      expiresAt
    }
  }
}
"""
