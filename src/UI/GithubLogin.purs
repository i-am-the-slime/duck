module UI.GithubLogin where

import Yoga.Prelude.View

import Biz.Github (clientID, scopes)
import Biz.Github.Types (AccessTokenRequest, DeviceCode, DeviceCodeRequest(..), DeviceCodeResponse(..), DeviceTokenError, GrantType(..), UserCode(..))
import Biz.OAuth.Types (GithubAccessToken)
import Control.Monad.Rec.Class (forever)
import Data.Array (intersperse)
import Data.Bifunctor (bimap, lmap)
import Data.Newtype (un)
import Data.String (codePointFromChar, toCodePointArray)
import Data.String as String
import Data.Time.Duration (Seconds(..), fromDuration)
import Debug (spy)
import Effect.Aff (Aff, attempt)
import Effect.Aff as Aff
import Fahrtwind (text4xl, textCol', underline)
import Foreign.Object as Object
import Network.RemoteData (RemoteData(..))
import Network.RemoteData as RD
import React.Basic.DOM as R
import React.Basic.Hooks as React
import React.Basic.Hooks.Aff (useAff)
import UI.Component as UI
import UI.Hook.UseRemoteData (useRemoteData)
import Yoga.Block as Block
import Yoga.Block.Container.Style (col)
import Yoga.Block.Organism.NotificationCentre.Notification.View (autoHideNotification)
import Yoga.Block.Organism.NotificationCentre.Types (NotificationCentre(..))
import Yoga.Fetch (Fetch, postMethod)
import Yoga.Fetch (Fetch, URL(..), fetch, statusCode, text) as Fetch
import Yoga.JSON (readJSON, writeJSON)

type Props =
  { onLoggedIn ∷ GithubAccessToken → Effect Unit
  }

loginURL ∷ Fetch.URL
loginURL = Fetch.URL
  $ "https://github.com/login/device/code"

loginArgs ∷ DeviceCodeRequest
loginArgs = DeviceCodeRequest
  { client_id: clientID
  , scope: scopes
  }

attemptString ∷ ∀ a. Aff (Either String a) → Aff (Either String a)
attemptString aff =
  attempt aff <#> (lmap show >>> join)

mkGithubLogin ∷ UI.Component Props
mkGithubLogin =
  UI.component "GithubLoginButton" \ctx (props ∷ Props) → React.do
    let
      fetch = Fetch.fetch ctx.fetchImpl
      sendNotification n = do
        let (NotificationCentre nc) = ctx.notificationCentre
        nc.enqueueNotification n
      notifyError message = sendNotification
        $ autoHideNotification
            { autoHideAfter: 10.0 # Seconds # fromDuration
            , title: "Error"
            , body: R.text message
            }
    code ← useRemoteData (\_ → getCode fetch)
    let codeʔ = RD.toMaybe code.data

    useAff codeʔ do
      for_ codeʔ \(DeviceCodeResponse { expires_in }) → do
        Aff.delay (expires_in # fromDuration)
        code.load unit # liftEffect

    useAff codeʔ do
      for_ codeʔ \(DeviceCodeResponse { interval, device_code }) → forever do
        Aff.delay (interval # fromDuration)
        result ← pollAccessToken fetch device_code
        liftEffect $ case result of
          Left err → notifyError (show err)
          Right (Left { error }) | error == "authorization_pending" → mempty
          Right (Left error) → notifyError (show error)
          Right (Right token) → props.onLoggedIn $ spy "token" token

    useEffect code.data do
      case code.data of
        Failure err → notifyError err
        _ → mempty
      mempty

    let
      button { disabled } =
        Block.button { disabled, onClick: handler_ (code.load unit) }
          [ R.text "Login with Github" ]

    pure $ case code.data of
      NotAsked → button { disabled: false }
      Loading → button { disabled: true }
      Failure _ → button { disabled: false }
      Success (DeviceCodeResponse { user_code }) →
        Block.stack_
          [ R.span_ [ R.text $ "Enter this code at " ]
          , R.a'
              </*
                { css: textCol' col.highlight <> underline
                , target: "_blank"
                , href: "https://github.com/login/device"
                }
              /> [ R.text "https://github.com/login/device" ]
          , R.span'
              </* { css: text4xl }
              />
                [ R.text
                    ( un UserCode user_code # toCodePointArray
                        # intersperse (' ' # codePointFromChar)
                        # String.fromCodePointArray
                    )
                ]
          ]

getCode ∷ Fetch.Fetch → Aff (Either String DeviceCodeResponse)
getCode fetch = attemptString do
  res ← fetch loginURL
    { method: postMethod
    , headers: Object.fromHomogeneous
        { "Accept": "application/json"
        , "Content-Type": "application/json"
        }
    , body: writeJSON loginArgs
    }
  case Fetch.statusCode res of
    200 → do
      errorOrBody ← Fetch.text res <#> readJSON
      pure $ lmap show errorOrBody
    code → do
      Fetch.text res <#> (show code <> _) >>> Left

pollAccessToken ∷
  Fetch →
  DeviceCode →
  Aff (Either String (Either DeviceTokenError GithubAccessToken))
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
