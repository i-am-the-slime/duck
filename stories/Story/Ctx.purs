module Story.Ctx where

import Prelude

import Biz.Github.Auth.Types (DeviceCode(..), DeviceCodeResponse(..), UserCode(..), VerificationURI(..))
import Biz.IPC.Message.Types (MessageToMain, MessageToRenderer)
import Biz.OAuth.Types (AccessToken(..), ScopeList(..), TokenType(..))
import Control.Alt (alt, (<|>))
import Data.Array (foldMap, singleton, foldl)
import Data.Array as Array
import Data.Either (either)
import Data.Foldable (for_, traverse_)
import Data.Maybe (Maybe(..), isNothing)
import Data.Time.Duration (Seconds(..))
import Data.UUID (UUID)
import Data.UUID as UUID
import Debug (spy)
import Effect (Effect)
import Effect.Class.Console as Console
import Effect.Ref as Ref
import Effect.Uncurried (EffectFn1, EffectFn2, runEffectFn1, runEffectFn2)
import Electron.Types (Channel(..))
import ElectronAPI (ElectronListener)
import Foreign (Foreign)
import Foreign.Internal.Stringify (unsafeStringify)
import Partial.Unsafe (unsafeCrashWith)
import React.Basic (JSX)
import React.Basic.DOM (text)
import Story.Ctx.OnMessageMocks (getMockGithubUserQuery, getMockInstalledTools, getMockIsLoggedIntoGithub, getMockReadme, getMockRegistry, getMockSolutionDefinition)
import Story.Ctx.Types (OnMessage)
import Story.Util.NotificationCentre (storyNotificationCentre)
import UI.Ctx.Types (Ctx)
import UI.GithubLogin.Repository (GetDeviceCode, PollAccessToken)
import Unsafe.Coerce (unsafeCoerce)
import Unsafe.Reference (unsafeRefEq)
import Yoga.JSON (writeJSON)
import Yoga.JSON as JSON

defaultOnMessage ∷ OnMessage
defaultOnMessage msg = tryAllOf
  [ getMockSolutionDefinition
  , getMockInstalledTools
  , getMockIsLoggedIntoGithub
  , getMockGithubUserQuery
  , getMockRegistry
  , getMockReadme
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
  listenersRef ← Ref.new ([] ∷ (Array ElectronListener))
  let
    registerListener listener = do
      listenersRef # Ref.modify_ (Array.cons listener)
      pure (listenersRef # Ref.modify_ (Array.filter (unsafeRefEq listener)))

    postMessage ∷ UUID → MessageToMain → Effect Unit
    postMessage uuid payload = do
      let
        msg ∷ MessageToMain
        msg = JSON.write payload # JSON.read
          # either (show >>> unsafeCrashWith) identity
      responseʔ ← onMessage msg
      for_ responseʔ \responseMessage → do
        listenersRef # Ref.read >>=
          traverse_
            ( \elecList → do
                let
                  listener ∷ EffectFn1 Foreign Unit
                  listener = unsafeCoerce elecList
                runEffectFn1 listener
                  ( JSON.write
                      { response_for_message_id: UUID.toString uuid
                      , response: responseMessage
                      }
                  )
            )

  pure
    { registerListener
    , postMessage
    , notificationCentre: storyNotificationCentre
    , githubAuth:
        { getDeviceCode: alwaysSucceedGetDeviceCode
        , pollAccessToken: getAccessTokenImmediately
        }
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