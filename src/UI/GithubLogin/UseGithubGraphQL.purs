module UI.GithubLogin.UseGithubGraphQL where

import Yoga.Prelude.View

import Backend.Github.API.Types (GithubGraphQLResponse(..), githubGraphQLQuery)
import Biz.GraphQL (GraphQL, GraphQLQuery, graphQLQuery)
import Biz.IPC.Message.Types (MessageToMain(..), MessageToRenderer(..))
import Data.Maybe (isNothing)
import Data.Newtype (class Newtype)
import Debug (spy)
import Foreign (ForeignError(..), MultipleErrors)
import Network.RemoteData (RemoteData)
import Network.RemoteData as RD
import React.Basic.Hooks as React
import UI.Component (Ctx)
import UI.GithubLogin.UseGithubToken (UseGithubToken, useGithubToken)
import UI.Hook.UseIPCMessage (UseIPCMessage(..), useIPCMessage)
import Yoga.JSON (class ReadForeign, class WriteForeign)
import Yoga.JSON as JSON

newtype UseGithubGraphQL hooks = UseGithubGraphQL
  (UseIPCMessage MessageToRenderer (UseGithubToken hooks))

derive instance Newtype (UseGithubGraphQL hooks) _

useGithubGraphQL ∷
  ∀ i o.
  WriteForeign { | i } ⇒
  ReadForeign { | o } ⇒
  Ctx →
  GraphQL →
  Hook UseGithubGraphQL
    ((RemoteData MultipleErrors { | o }) /\ ({ | i } → Effect Unit))
useGithubGraphQL ctx query = coerceHook React.do
  tokenʔ /\ _ ← useGithubToken
  sendViaIPC /\ ipcResult ← useIPCMessage ctx
  let
    send (input ∷ { | i }) = for_ (spy "inner token" tokenʔ) \token → do
      let
        gqlQ ∷ GraphQLQuery { | i }
        gqlQ = graphQLQuery query input
      sendViaIPC $
        QueryGithubGraphQL
          { token
          , query: githubGraphQLQuery gqlQ
          }

    result =
      if (tokenʔ # isNothing) then
        RD.Failure $ pure $ ForeignError "User is not logged in to github"
      else
        case ipcResult of
          RD.Success (GithubGraphQLResult (GithubGraphQLResponse res)) →
            JSON.readJSON res # RD.fromEither
          RD.Success _ → RD.Failure $ pure $ ForeignError "Invalid response"
          RD.Failure f → RD.Failure f
          RD.Loading → RD.Loading
          RD.NotAsked → RD.NotAsked

  pure (result /\ send)