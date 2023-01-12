module UI.GithubLogin.UseGithubUserInfo where

import Yoga.Prelude.View

import Backend.Github.API.Types (GithubGraphQLResponse(..), githubGraphQLQuery)
import Biz.GraphQL (GraphQL(..), graphQLQuery)
import Biz.IPC.Message.Types (MessageToMain(..), NoGithubToken(..))
import Data.Lens.Barlow (barlow)
import Network.RemoteData as RD
import React.Basic.Hooks as React
import Type.Prelude (Proxy(..))
import UI.Ctx.Types (Ctx)
import UI.Hook.UseIPC (UseIPC, useIPC)

useGithubUserInfo ∷ Ctx → Hook UseIPC ((Maybe String) /\ (Effect Unit))
useGithubUserInfo ctx = React.do
  { data: res, send } ← useIPC ctx
    (barlow (Proxy ∷ Proxy ("%GithubGraphQLResult")))
  let
    result = case res # RD.toMaybe of
      Nothing → Nothing
      Just (Right (GithubGraphQLResponse s)) →
        Just s
      Just (Left NoGithubToken) → Nothing

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
