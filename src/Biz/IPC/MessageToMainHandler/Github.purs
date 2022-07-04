module Biz.IPC.MessageToMainHandler.Github where

import Prelude

import Backend.Github.API as GithubGraphQL
import Backend.Github.API.Types (GithubGraphQLQuery)
import Biz.Github.API.Auth as Auth
import Biz.Github.Types (DeviceCode)
import Biz.IPC.Message.Types (MessageToRenderer(..), failedOrFromEither)
import Biz.OAuth.Types (GithubAccessToken)
import Data.Maybe (Maybe(..))
import Effect.Aff (Aff)
import Effect.Class (liftEffect)
import Electron (decryptString, getUserDataDirectory)
import Node.FS.Aff as AFS
import Node.FS.Sync as FS
import Node.Path as Path
import Yoga.Fetch as Fetch
import Yoga.Fetch.Impl.Node (nodeFetch)
import Yoga.JSON as JSON

queryGithubGraphQL ∷
  { token ∷ GithubAccessToken, query ∷ GithubGraphQLQuery } →
  Aff (MessageToRenderer)
queryGithubGraphQL { token, query } = GithubGraphQLResult <$>
  GithubGraphQL.sendRequest token query

githubTokenFile ∷ String
githubTokenFile = "github-token"

getStoredGithubAccessToken ∷ Aff MessageToRenderer
getStoredGithubAccessToken = GetStoredGithubAccessTokenResult <$> do
  dir ← getUserDataDirectory # liftEffect
  let path = Path.concat [ dir, githubTokenFile ]
  pathExists ← FS.exists path # liftEffect
  if not pathExists then pure Nothing
  else do
    buf ← AFS.readFile path
    strʔ ← decryptString buf # liftEffect
    pure $ JSON.readJSON_ =<< strʔ

getGithubDeviceCode ∷ Aff MessageToRenderer
getGithubDeviceCode =
  (GithubLoginGetDeviceCodeResult <<< failedOrFromEither) <$>
    Auth.getDeviceCode (Fetch.fetch nodeFetch)

pollGithubAccessToken ∷ DeviceCode → Aff MessageToRenderer
pollGithubAccessToken deviceCode =
  ( GithubPollAccessTokenResult <<< failedOrFromEither <<< map
      failedOrFromEither
  ) <$> Auth.pollAccessToken (Fetch.fetch nodeFetch) deviceCode
