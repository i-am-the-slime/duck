module UI.GithubLogin.UseGithubGraphQL where

import Yoga.Prelude.View

import Backend.Github.API.Types (GithubGraphQLResponse(..), githubGraphQLQuery)
import Biz.GraphQL (GraphQL, GraphQLQuery, graphQLQuery)
import Biz.IPC.Message.Types (FailedOr(..), MessageToMain(..), MessageToRenderer(..), NoGithubToken(..))
import Data.Newtype (class Newtype)
import Foreign (ForeignError(..), MultipleErrors)
import Network.RemoteData (RemoteData)
import Network.RemoteData as RD
import React.Basic.Hooks as React
import UI.Component (Ctx)
import UI.Hook.UseIPCMessage (UseIPCMessage(..), useIPCMessage)
import Yoga.JSON (class ReadForeign, class WriteForeign)
import Yoga.JSON as JSON

newtype UseGithubGraphQL hooks = UseGithubGraphQL (UseIPCMessage hooks)

derive instance Newtype (UseGithubGraphQL hooks) _

useGithubGraphQL ∷
  ∀ @i @o.
  WriteForeign { | i } ⇒
  ReadForeign { | o } ⇒
  Ctx →
  GraphQL →
  Hook UseGithubGraphQL
    ((RemoteData MultipleErrors { | o }) /\ ({ | i } → Effect Unit))
useGithubGraphQL ctx query = coerceHook React.do
  ipcResult /\ sendViaIPC /\ _ ← useIPCMessage ctx
  let
    send (input ∷ { | i }) = do
      let
        gqlQ ∷ GraphQLQuery { | i }
        gqlQ = graphQLQuery query input
      sendViaIPC $
        QueryGithubGraphQL (githubGraphQLQuery gqlQ)

    result =
      case ipcResult of
        RD.Success (GithubGraphQLResult (Succeeded (GithubGraphQLResponse res))) →
          JSON.readJSON res # RD.fromEither
        RD.Success (GithubGraphQLResult (Failed NoGithubToken)) →
          RD.Failure $ pure $ ForeignError "no github token"
        RD.Success _ → RD.Failure $ pure $ ForeignError "Invalid response"
        RD.Failure _ → RD.Failure $ pure $ ForeignError "IPC Problem"
        RD.Loading → RD.Loading
        RD.NotAsked → RD.NotAsked

  pure (result /\ send)