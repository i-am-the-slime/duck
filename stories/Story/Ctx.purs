module Story.Ctx where

import Prelude

import Biz.Github.Auth.Types (DeviceCode(..), DeviceCodeResponse(..), UserCode(..), VerificationURI(..))
import Biz.OAuth.Types (AccessToken(..), ScopeList(..), TokenType(..))
import Data.Array (foldl, singleton)
import Data.Maybe (Maybe(..))
import Data.Time.Duration (Seconds(..))
import Debug (spy)
import Effect (Effect)
import Effect.Class (liftEffect)
import Effect.Class.Console as Console
import Effect.Ref as Ref
import ElectronAPI (ElectronListener)
import React.Basic (JSX)
import React.Basic.DOM (text)
import Story.Ctx.OnMessageMocks (getMockGithubUserQuery, getMockInstalledTools, getMockIsLoggedIntoGithub, getMockLoadWorksheetFile, getMockOwnerImage, getMockReadme, getMockRegistry, getMockRepoDetails, getMockSolutionDefinition)
import Story.Ctx.Types (OnMessage)
import Story.Util.NotificationCentre (storyNotificationCentre)
import UI.Ctx.Electron (mkGithubGraphQLCache)
import UI.Ctx.Types (Ctx)
import UI.GithubLogin.Repository (GetDeviceCode, PollAccessToken)
import Unsafe.Coerce (unsafeCoerce)
import Yoga.JSON as JSON

defaultOnMessage ∷ OnMessage
defaultOnMessage msg = tryAllOf
  [ getMockSolutionDefinition
  , getMockInstalledTools
  , getMockIsLoggedIntoGithub
  , getMockGithubUserQuery
  , getMockRegistry
  , getMockRepoDetails
  , getMockReadme
  , getMockOwnerImage
  , getMockLoadWorksheetFile
  -- This stays last
  , logUnhandled
  ]
  where
  tryAllOf =
    foldl
      ( \acc fn → do
          accRes ← acc
          case accRes of
            Just _ → pure accRes
            Nothing → fn msg
      )
      (pure Nothing)
  logUnhandled = \m → ado
    Console.error ("Unhandled message")
    Console.error (unsafeCoerce (JSON.write m))
    in Nothing

mkStoryCtx ∷ OnMessage → Effect Ctx
mkStoryCtx onMessage = do
  githubGraphQLCache ← mkGithubGraphQLCache

  let
    sendIPCMessage = \msg → liftEffect do
      resʔ ← onMessage msg
      case resʔ of
        Nothing → do
          Console.debug "Unhandled message"
          let _ = spy "message" msg
          pure $ unsafeCoerce {}
        Just r → pure r
  pure
    { sendIPCMessage
    , streamIPCMessage: \_ _ → pure unit
    , notificationCentre: storyNotificationCentre
    , githubAuth:
        { getDeviceCode: alwaysSucceedGetDeviceCode
        , pollAccessToken: getAccessTokenImmediately
        }
    , githubGraphQLCache
    }

alwaysSucceedGetDeviceCode ∷ GetDeviceCode
alwaysSucceedGetDeviceCode = pure
  ( pure
      ( DeviceCodeResponse
          { device_code: DeviceCode "123"
          , expires_in: Seconds 900.0
          , interval: Seconds 10.0
          , user_code: UserCode "12c4-540O"
          , verification_uri: VerificationURI "https://purescript.org"
          }
      )
  )

getAccessTokenImmediately ∷ PollAccessToken
-- DeviceCode →
-- Aff (Either String (Either DeviceTokenError GithubAccessToken))
getAccessTokenImmediately _ = pure
  ( pure
      ( pure
          { access_token: AccessToken "123"
          , token_type: TokenType "fake"
          , scope: ScopeList "user,repo"
          }
      )
  )

class ToJSX jsx where
  toJSX ∷ jsx → Array JSX

instance ToJSX (Array JSX) where
  toJSX = identity
else instance (ToJSX t) ⇒ ToJSX (Array t) where
  toJSX arr = arr >>= toJSX
else instance ToJSX String where
  toJSX = text >>> singleton
else instance ToJSX JSX where
  toJSX = singleton

comma ∷ ∀ a b. ToJSX a ⇒ ToJSX b ⇒ a → b → Array JSX
comma a b = toJSX a <> toJSX b

infixl 5 comma as ++
