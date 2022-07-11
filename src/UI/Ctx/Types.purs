module UI.Ctx.Types where

import Prelude

import Biz.IPC.Message.Types (MessageToMain)
import Data.UUID (UUID)
import Effect (Effect)
import ElectronAPI (ElectronListener)
import Yoga.Block.Organism.NotificationCentre.Types (NotificationCentre)
import UI.GithubLogin.Repository (GetDeviceCode, PollAccessToken)

type Ctx =
  { registerListener ∷ ElectronListener → Effect (Effect Unit)
  , postMessage ∷ UUID → MessageToMain → Effect Unit
  , notificationCentre ∷ NotificationCentre
  , githubAuth ∷
      { getDeviceCode ∷ GetDeviceCode
      , pollAccessToken ∷ PollAccessToken
      }
  }