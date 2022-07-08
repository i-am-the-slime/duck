module UI.Ctx.Electron where

import Prelude

import Data.UUID as UUID
import Effect (Effect)
import Electron.Types (Channel(..))
import ElectronAPI as ElectronAPI
import UI.Component (Ctx)
import UI.GithubLogin.Repository (getDeviceCode, pollAccessToken)
import UI.PostMessage (postMessage)
import Yoga.Block.Organism.NotificationCentre (mkNotificationCentre)
import Yoga.Fetch as F
import Yoga.Fetch.Impl.Window (windowFetch)
import Yoga.JSON as JSON

mkElectronCtx ∷ Effect Ctx
mkElectronCtx = ado
  notificationCentre ← mkNotificationCentre
  in
    { registerListener: ElectronAPI.on (Channel "ipc")
    , removeListener: ElectronAPI.removeListener (Channel "ipc")
    , postMessage: \uuid payload → postMessage $ JSON.write
        { type: "ipc", data: { message_id: UUID.toString uuid, payload } }
    , notificationCentre
    , githubAuth:
        { getDeviceCode: getDeviceCode (F.fetch windowFetch)
        , pollAccessToken: pollAccessToken (F.fetch windowFetch)
        }
    }