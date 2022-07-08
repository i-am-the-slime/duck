module UI.GithubLogin.UseGithubUserInfo where

import Yoga.Prelude.View

import Backend.Github.API.Types (GithubGraphQLResponse(..), githubGraphQLQuery)
import Biz.GraphQL (GraphQL(..), graphQLQuery)
import Biz.IPC.Message.Types (FailedOr(..), MessageToMain(..), MessageToRenderer(..), NoGithubToken(..))
import Control.Monad.Reader (ask)
import Data.Maybe (Maybe(..))
import Network.RemoteData as RD
import Partial.Unsafe (unsafePartial)
import React.Basic.Hooks as React
import UI.Hook.UseIPCMessage (useIPCMessage)

useGithubUserInfo ctx = do
  pure $ coerceHook React.do
    res /\ send /\ _ ← useIPCMessage ctx
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