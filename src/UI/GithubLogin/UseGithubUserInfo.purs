module UI.GithubLogin.UseGithubUserInfo where

import Yoga.Prelude.View

import Backend.Github.API.Types (githubGraphQLQuery)
import Biz.GraphQL (GraphQL(..), graphQLQuery)
import Biz.IPC.Message.Types (MessageToMain(..))
import Control.Monad.Reader (ask)
import React.Basic.Hooks as React
import UI.GithubLogin.UseGithubToken (useGithubToken)
import UI.Hook.UseIPCMessage (useIPCMessage)

mkUseGithubUserInfo = do
  ctx ← ask
  pure $ coerceHook React.do
    tokenʔ /\ _ ← useGithubToken
    send /\ result ← useIPCMessage ctx
    useEffect tokenʔ do
      for_ tokenʔ \token →
        send $ QueryGithubGraphQL
          { token
          , query: githubGraphQLQuery (graphQLQuery query {})
          }
      mempty
    pure tokenʔ

query ∷ GraphQL
query = GraphQL
  """
query{
  viewer {
    login
    name
    interactionAbility {
      expiresAt
    }
  }
}
"""