module UI.Ctx.Electron where

import Prelude

import Biz.GraphQL (GraphQLQuery)
import Control.Monad.Rec.Class (forever)
import Data.DateTime (DateTime, adjust)
import Data.Foldable (for_)
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Data.String as String
import Data.Time.Duration (class Duration, Minutes(..), fromDuration)
import Data.UUID as UUID
import Effect (Effect)
import Effect.Aff (forkAff, launchAff_)
import Effect.Aff as Aff
import Effect.Class (liftEffect)
import Effect.Class.Console as Console
import Effect.Now (nowDateTime)
import Effect.Now as Now
import Effect.Ref as Ref
import Electron.Types (Channel(..))
import ElectronAPI as ElectronAPI
import UI.Ctx.Types (Ctx, GithubGraphQLCache(..))
import UI.GithubLogin.Repository (getDeviceCode, pollAccessToken)
import Web.HTML (window)
import Web.HTML.Window (localStorage)
import Web.Storage.Storage as LocalStorage
import Yoga.Block.Organism.NotificationCentre (mkNotificationCentre)
import Yoga.Fetch as F
import Yoga.Fetch.Impl.Window (windowFetch)
import Yoga.JSON (class WriteForeign)
import Yoga.JSON as JSON

mkElectronCtx ∷ Effect Ctx
mkElectronCtx = ado
  notificationCentre ← mkNotificationCentre
  githubGraphQLCache ← mkGithubGraphQLCache
  in
    { registerListener: ElectronAPI.on (Channel "ipc")
    , postMessage: \uuid payload → ElectronAPI.sendToMain $ JSON.write
        { type: "ipc", data: { message_id: UUID.toString uuid, payload } }
    , notificationCentre
    , githubAuth:
        { getDeviceCode: getDeviceCode (F.fetch windowFetch)
        , pollAccessToken: pollAccessToken (F.fetch windowFetch)
        }
    , githubGraphQLCache
    }

type CacheEntry =
  { cachedAt ∷ DateTime
  , cachedUntil ∷ DateTime
  , value ∷ String
  }

mkGithubGraphQLCache ∷ Effect GithubGraphQLCache
mkGithubGraphQLCache = do
  cacheRef ← Ref.new Map.empty
  prepopulateFromStorage cacheRef
  launchAff_ $ forever do
    Aff.delay (5.0 # Minutes # fromDuration)
    cleanupCache cacheRef # liftEffect
    saveInStorage cacheRef # liftEffect
  let
    cache ∷
      ∀ v d.
      WriteForeign v ⇒
      Show d ⇒
      Duration d ⇒
      d →
      GraphQLQuery v →
      String →
      Effect Unit
    cache duration query result = do
      let key = JSON.writeJSON query
      now ← Now.nowDateTime
      let untilʔ = now # adjust duration

      case untilʔ of
        Nothing → do
          Console.error $ "Won't cache: Invalid duration " <> show duration
        Just until → do
          cacheRef # Ref.modify_
            ( Map.insert key
                ( { cachedAt: now
                  , cachedUntil: until
                  , value: result
                  } ∷ CacheEntry
                )
            )

    lookup ∷ ∀ v. WriteForeign v ⇒ GraphQLQuery v → Effect (Maybe String)
    lookup query = do
      now ← Now.nowDateTime
      let key = JSON.writeJSON query
      cache ← Ref.read cacheRef
      case Map.lookup key cache of
        Just { cachedUntil, value } | cachedUntil > now → do
          Console.info $ "Cache hit for " <> String.take 20 key <> "..."
          pure (Just value)
        Just _ → do
          Console.info $ "Stale cache hit for " <> String.take 20 key <> "..."
          cacheRef # Ref.modify_ (Map.delete key)
          pure Nothing
        Nothing → do
          Console.info $ "Cache miss for " <> String.take 20 key <> "..."
          pure Nothing

  pure $ GithubGraphQLCache { cache, lookup }
  where

  storageKey = "duck_github-graphql-cache"

  prepopulateFromStorage cacheRef = do
    storage ← window >>= localStorage
    storedʔ ← LocalStorage.getItem storageKey storage
    for_ storedʔ \stored → do
      let storedCacheʔ = JSON.readJSON stored
      for_ storedCacheʔ \storedCache →
        cacheRef # Ref.write storedCache

  saveInStorage cacheRef = do
    storage ← window >>= localStorage
    theCache ∷ Map String CacheEntry ← Ref.read cacheRef
    LocalStorage.setItem storageKey (JSON.writeJSON theCache) storage

  cleanupCache cacheRef = do
    Console.info "Cleaning up cache"
    now ← nowDateTime
    cacheRef # Ref.modify_
      (Map.filter \{ cachedUntil } → cachedUntil < now)
