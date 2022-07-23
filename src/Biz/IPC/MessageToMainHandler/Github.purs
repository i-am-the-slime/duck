module Biz.IPC.MessageToMainHandler.Github where

import Prelude

import Backend.Github.API as GithubGraphQL
import Backend.Github.API.Types (GithubGraphQLQuery)
import Biz.Github.API.Auth as Auth
import Biz.Github.Auth.Types (DeviceCode)
import Biz.IPC.Message.Types (MessageToRenderer(..), NoGithubToken(..))
import Biz.OAuth.Types (GithubAccessToken)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..), isJust)
import Effect.Aff (Aff)
import Effect.Class (liftEffect)
import Effect.Class.Console as Console
import Electron (decryptString, encryptString, getUserDataDirectory)
import Node.FS.Aff as AFS
import Node.FS.Sync as FS
import Node.Path as Path
import Yoga.Fetch as Fetch
import Yoga.Fetch.Impl.Node (nodeFetch)
import Yoga.JSON as JSON

queryGithubGraphQL ∷
  GithubGraphQLQuery →
  Aff (MessageToRenderer)
queryGithubGraphQL query = GithubGraphQLResult <$> do
  tokenʔ ← readStoredGithubAccessToken
  case tokenʔ of
    Just token → Right <$> GithubGraphQL.sendRequest token query
    Nothing → pure $ Left NoGithubToken

githubTokenFile ∷ String
githubTokenFile = "github-token"

getIsLoggedIntoGithub ∷ Aff MessageToRenderer
getIsLoggedIntoGithub =
  (GetIsLoggedIntoGithubResult <<< isJust)
    <$> readStoredGithubAccessToken

readStoredGithubAccessToken ∷ Aff (Maybe GithubAccessToken)
readStoredGithubAccessToken = do
  dir ← getUserDataDirectory # liftEffect
  let path = Path.concat [ dir, githubTokenFile ]
  pathExists ← FS.exists path # liftEffect
  if not pathExists then pure Nothing
  else do
    buf ← AFS.readFile path
    strʔ ← decryptString buf # liftEffect
    pure $ JSON.readJSON_ =<< strʔ

storeGithubAccessToken ∷ GithubAccessToken → Aff Unit
storeGithubAccessToken token = do
  dir ← getUserDataDirectory # liftEffect
  let path = Path.concat [ dir, githubTokenFile ]
  encryptedBufʔ ← encryptString (JSON.writeJSON token) # liftEffect
  case encryptedBufʔ of
    Nothing → Console.error "Failed to encrypt token"
    Just buf → AFS.writeFile path buf

getGithubDeviceCode ∷ Aff MessageToRenderer
getGithubDeviceCode =
  GithubLoginGetDeviceCodeResult <$>
    Auth.getDeviceCode (Fetch.fetch nodeFetch)

pollGithubAccessToken ∷ DeviceCode → Aff MessageToRenderer
pollGithubAccessToken deviceCode = do
  response ← Auth.pollAccessToken (Fetch.fetch nodeFetch) deviceCode
  case response of
    Right (Right token) → do
      Console.info "Stored Github Access Token"
      storeGithubAccessToken token
    _ → pure unit
  pure
    <<< GithubPollAccessTokenResult
    $ response
