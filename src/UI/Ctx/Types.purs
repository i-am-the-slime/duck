module UI.Ctx.Types where

import Prelude

import Biz.GraphQL (GraphQLQuery)
import Biz.IPC.Message.Types (MessageToMain, MessageToRenderer)
import Data.Maybe (Maybe)
import Data.Time.Duration (class Duration)
import Data.UUID (UUID)
import Effect (Effect)
import Effect.Aff (Aff)
import ElectronAPI (ElectronListener)
import UI.GithubLogin.Repository (GetDeviceCode, PollAccessToken)
import Yoga.Block.Organism.NotificationCentre.Types (NotificationCentre)
import Yoga.JSON (class WriteForeign)

type Ctx =
  { notificationCentre ∷ NotificationCentre
  , sendIPCMessage ∷ MessageToMain → Aff MessageToRenderer
  , githubAuth ∷
      { getDeviceCode ∷ GetDeviceCode
      , pollAccessToken ∷ PollAccessToken
      }
  , githubGraphQLCache ∷ GithubGraphQLCache
  }

newtype GithubGraphQLCache = GithubGraphQLCache
  { lookup ∷ ∀ v. WriteForeign v ⇒ GraphQLQuery v → Effect (Maybe String)
  , cache ∷
      ∀ v d.
      WriteForeign v ⇒
      Duration d ⇒
      Show d ⇒
      d →
      GraphQLQuery v →
      String →
      Effect Unit
  }
