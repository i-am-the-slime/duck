module UI.GithubLogin.UseGithubGraphQL where

import Yoga.Prelude.View

import Backend.Github.API.Types (GithubGraphQLResponse(..), githubGraphQLQuery)
import Biz.GraphQL (GraphQL, GraphQLQuery, graphQLQuery)
import Biz.IPC.Message.Types (MessageToMain(..), NoGithubToken(..))
import Data.Lens.Barlow (barlow)
import Data.Newtype (class Newtype)
import Data.Time.Duration (Hours)
import Foreign (ForeignError(..), MultipleErrors)
import Network.RemoteData (RemoteData)
import Network.RemoteData as RD
import React.Basic.Hooks (type (&))
import React.Basic.Hooks as React
import Type.Prelude (Proxy(..))
import UI.Ctx.Types (Ctx, GithubGraphQLCache(..))
import UI.Hook.UseIPC (UseIPC, useIPC)
import Yoga.JSON (class ReadForeign, class WriteForeign)
import Yoga.JSON as JSON

newtype UseGithubGraphQL i hooks =
  UseGithubGraphQL
    ( hooks
        & UseIPC
        & UseState (Maybe String)
        & UseState (Maybe (GraphQLQuery { | i }))
        & UseEffect
            (RemoteData String (Either NoGithubToken GithubGraphQLResponse))
    )

derive instance Newtype (UseGithubGraphQL i hooks) _

useGithubGraphQL ∷
  ∀ i o.
  WriteForeign { | i } ⇒
  ReadForeign { | o } ⇒
  Ctx →
  (Maybe Hours) →
  GraphQL →
  Hook (UseGithubGraphQL i)
    { data ∷ (RemoteData MultipleErrors { | o })
    , send ∷ ({ | i } → Effect Unit)
    }
useGithubGraphQL ctx cacheDurationʔ query = coerceHook React.do
  { data: ipcResult, send: sendViaIPC, reset } ← useIPC ctx
    (barlow (Proxy ∷ Proxy "%GithubGraphQLResult"))
  cachedResultʔ /\ setCachedResult ← React.useState' (Nothing ∷ Maybe String)
  lastInputʔ /\ setLastInput ← React.useState'
    (Nothing ∷ Maybe (GraphQLQuery { | i }))

  useEffect ipcResult do
    case lastInputʔ, ipcResult of
      Just query, RD.Success (Right (GithubGraphQLResponse res)) → do
        let GithubGraphQLCache { cache } = ctx.githubGraphQLCache
        for_ cacheDurationʔ \duration → cache duration query res
      _, _ → pure unit

    mempty
  let
    send (input ∷ { | i }) = do
      let
        gqlQ ∷ GraphQLQuery { | i }
        gqlQ = graphQLQuery query input
      let GithubGraphQLCache { lookup } = ctx.githubGraphQLCache
      cachedʔ ← lookup gqlQ
      case cachedʔ of
        Just cached → do
          setCachedResult (Just cached)
        Nothing → do
          setCachedResult Nothing
          setLastInput (Just gqlQ)
          reset
          sendViaIPC $
            QueryGithubGraphQL (githubGraphQLQuery gqlQ)

    result = (cachedResultʔ <#> (JSON.readJSON >>> RD.fromEither)) # fromMaybe
      case ipcResult of
        RD.Success (Right (GithubGraphQLResponse res)) →
          JSON.readJSON res # RD.fromEither
        RD.Success (Left NoGithubToken) →
          RD.Failure $ pure $ ForeignError "no github token"
        RD.Failure e →
          RD.Failure $ pure $ ForeignError e
        RD.Loading → RD.Loading
        RD.NotAsked → RD.NotAsked

  pure { data: result, send }

useDynamicGithubGraphQL ∷
  ∀ i o.
  WriteForeign { | i } ⇒
  ReadForeign { | o } ⇒
  Ctx →
  (Maybe Hours) →
  Hook (UseGithubGraphQL i)
    ((RemoteData MultipleErrors { | o }) /\ (GraphQL → { | i } → Effect Unit))
useDynamicGithubGraphQL ctx cacheDurationʔ = coerceHook React.do
  { data: ipcResult, send: sendViaIPC, reset } ← useIPC ctx
    (barlow (Proxy ∷ Proxy ("%GithubGraphQLResult")))
  cachedResultʔ /\ setCachedResult ← React.useState' Nothing
  lastInputʔ /\ setLastInput ← React.useState'
    (Nothing ∷ Maybe (GraphQLQuery { | i }))

  useEffect ipcResult do
    case lastInputʔ, ipcResult of
      Just query, RD.Success (Right (GithubGraphQLResponse res)) → do
        let GithubGraphQLCache { cache } = ctx.githubGraphQLCache
        for_ cacheDurationʔ \duration → cache duration query res
      _, _ → pure unit

    mempty
  let
    send query (input ∷ { | i }) = do
      let
        gqlQ ∷ GraphQLQuery { | i }
        gqlQ = graphQLQuery query input

        GithubGraphQLCache { lookup } = ctx.githubGraphQLCache
      cachedʔ ← lookup gqlQ
      case cachedʔ of
        Just cached → do
          setCachedResult (Just cached)
        Nothing → do
          setCachedResult Nothing
          setLastInput (Just gqlQ)
          reset
          sendViaIPC $
            QueryGithubGraphQL (githubGraphQLQuery gqlQ)

    result = (cachedResultʔ <#> (JSON.readJSON >>> RD.fromEither)) # fromMaybe
      case ipcResult of
        RD.Success (Right (GithubGraphQLResponse res)) →
          JSON.readJSON res # RD.fromEither
        RD.Success (Left NoGithubToken) →
          RD.Failure $ pure $ ForeignError "no github token"
        RD.Failure _ → RD.Failure $ pure $ ForeignError "IPC Problem"
        RD.Loading → RD.Loading
        RD.NotAsked → RD.NotAsked

  pure (result /\ send)
