module UI.Ctx.Electron where

import Prelude

import Biz.IPC.Message.Types (mainToRendererChannelName, rendererToMainChannelName)
import Effect (Effect)
import ElectronAPI as ElectronAPI
import UI.Component (Ctx)
import UI.PostMessage (postMessage)
import Yoga.Block.Organism.NotificationCentre (mkNotificationCentre)
import Yoga.Fetch.Impl.Window (windowFetch)

mkElectronCtx ∷ Effect Ctx
mkElectronCtx = ado
  notificationCentre ← mkNotificationCentre
  in
    { registerListener: mainToRendererChannelName >>> ElectronAPI.on
    , removeListener: mainToRendererChannelName >>> ElectronAPI.removeListener
    , postMessage: \c f → postMessage
        { type: rendererToMainChannelName c, data: f }
    , notificationCentre
    , fetchImpl: windowFetch
    }