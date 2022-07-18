module Biz.Github.API.Auth where

import Yoga.Prelude.View

import Biz.Github (clientID, scopes)
import Biz.Github.Auth.Types (AccessTokenRequest, DeviceCode, DeviceCodeRequest(..), DeviceCodeResponse, DeviceTokenError, GrantType(..))
import Biz.OAuth.Types (GithubAccessToken)
import Data.Bifunctor (bimap, lmap)
import Effect.Aff (Aff, attempt)
import Foreign.Object as Object
import Yoga.Fetch (Fetch, URL(..), statusCode, text) as Fetch
import Yoga.Fetch (Fetch, postMethod)
import Yoga.JSON (readJSON, writeJSON)

type GetDeviceCode = Aff (Either String DeviceCodeResponse)

getDeviceCode ∷ Fetch.Fetch → GetDeviceCode
getDeviceCode fetch = attemptString do
  res ← fetch (Fetch.URL "https://github.com/login/device/code")
    { method: postMethod
    , headers: Object.fromHomogeneous
        { "Accept": "application/json"
        , "Content-Type": "application/json"
        }
    , body: writeJSON $ DeviceCodeRequest
        { client_id: clientID
        , scope: scopes
        }
    }
  case Fetch.statusCode res of
    200 → do
      errorOrBody ← Fetch.text res <#> readJSON
      pure $ lmap show errorOrBody
    code → do
      Fetch.text res <#> (show code <> _) >>> Left

type PollAccessToken =
  DeviceCode →
  Aff (Either String (Either DeviceTokenError GithubAccessToken))

pollAccessToken ∷ Fetch → PollAccessToken
pollAccessToken fetch device_code = attemptString do
  res ← fetch (Fetch.URL "https://github.com/login/oauth/access_token")
    { method: postMethod
    , headers: Object.fromHomogeneous
        { "Accept": "application/json"
        , "Content-Type": "application/json"
        }
    , body: writeJSON
        ( { client_id: clientID
          , device_code
          , grant_type: GrantType "urn:ietf:params:oauth:grant-type:device_code"
          } ∷ AccessTokenRequest
        )
    }
  case Fetch.statusCode res of
    200 → do
      stringBody ← Fetch.text res
      pure
        $ (readJSON stringBody # bimap show Left)
        <|> (readJSON stringBody # bimap show Right)
    code → do
      Fetch.text res <#> (show code <> _) >>> Left

attemptString ∷ ∀ a. Aff (Either String a) → Aff (Either String a)
attemptString aff =
  attempt aff <#> (lmap show >>> join)
