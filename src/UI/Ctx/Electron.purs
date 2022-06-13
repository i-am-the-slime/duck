module UI.Ctx.Electron where

import ElectronAPI as ElectronAPI
import UI.Component (Ctx)
import UI.PostMessage (postMessage)

electronCtx :: Ctx
electronCtx =
  { registerListener: ElectronAPI.on
  , removeListener: ElectronAPI.removeListener
  , postMessage: \c f -> postMessage { type: c, data: f }

  }