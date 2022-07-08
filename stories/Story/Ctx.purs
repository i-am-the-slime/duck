module Story.Ctx where

import Prelude

import Biz.Github.Types (DeviceCode(..), DeviceCodeResponse(..), UserCode(..), VerificationURI(..))
import Biz.IPC.Message.Types (MessageToMain, MessageToRenderer)
import Biz.OAuth.Types (AccessToken(..), ScopeList(..), TokenType(..))
import Control.Alt (alt, (<|>))
import Data.Array (foldMap, singleton, foldl)
import Data.Array as Array
import Data.Either (either)
import Data.Foldable (for_, traverse_)
import Data.Maybe (Maybe(..))
import Data.Time.Duration (Seconds(..))
import Data.UUID (UUID)
import Data.UUID as UUID
import Effect (Effect)
import Effect.Ref as Ref
import Effect.Uncurried (EffectFn2, runEffectFn2)
import Electron.Types (Channel(..))
import ElectronAPI (ElectronListener)
import Foreign (Foreign)
import Partial.Unsafe (unsafeCrashWith)
import React.Basic (JSX)
import React.Basic.DOM (text)
import Story.Ctx.OnMessageMocks (getMockGithubUserQuery, getMockInstalledTools, getMockIsLoggedIntoGithub, getMockRegistry, getMockSolutionDefinition)
import Story.Ctx.Types (OnMessage)
import Story.Util.NotificationCentre (storyNotificationCentre)
import UI.Component (Ctx)
import UI.GithubLogin.Repository (GetDeviceCode, PollAccessToken)
import Unsafe.Coerce (unsafeCoerce)
import Unsafe.Reference (unsafeRefEq)
import Yoga.JSON as JSON

defaultOnMessage ∷ OnMessage
defaultOnMessage msg = tryAllOf
  [ getMockSolutionDefinition
  , getMockInstalledTools
  , getMockIsLoggedIntoGithub
  , getMockGithubUserQuery
  , getMockRegistry
  ]
  where
  tryAllOf =
    foldl
      ( \acc fn → ado
          res ← fn msg
          accRes ← acc
          in (accRes <|> res)
      )
      (pure Nothing)

mkStoryCtx ∷ OnMessage → Effect Ctx
mkStoryCtx onMessage = do
  listenersRef ← Ref.new ([] ∷ (Array ElectronListener))
  let
    registerListener listener = do
      listenersRef # Ref.modify_ (Array.cons listener)
    removeListener listener = do
      listenersRef # Ref.modify_ (Array.filter (unsafeRefEq listener))

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
                  listener ∷ EffectFn2 Channel Foreign Unit
                  listener = unsafeCoerce elecList
                runEffectFn2 listener (Channel "ipc")
                  ( JSON.write
                      { response_for_message_id: UUID.toString uuid
                      , response: responseMessage
                      }
                  )
            )

  pure
    { registerListener
    , removeListener
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