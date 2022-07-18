module UI.Tool.Spago where

import Yoga.Prelude.View (Maybe(..), Unit, absurd, discard, foldMap, mempty, pure, (#), ($), (/\))

import Backend.Tool.Spago.Types (SpagoGlobalCacheDir(..))
import Biz.IPC.Message.Types (FailedOr(..), MessageToMain(..), MessageToRenderer(..))
import Network.RemoteData as RD
import React.Basic.DOM as R
import React.Basic.Hooks as React
import UI.Component as UI
import UI.Hook.UseIPCMessage (useIPCMessage)
import UI.Notification.ErrorNotification (errorNotification)
import UI.Notification.SendNotification (sendNotification)
import Yoga.Block.Hook.UseStateEq (useStateEq')
import Yoga.JSON (writeJSON)

mkView ∷ UI.Component Unit
mkView = do
  UI.component "SpagoInfo" \ctx _ → React.do
    cacheDirʔ ← useGetSpagoGlobalCache ctx
    pure $ cacheDirʔ # foldMap \(SpagoGlobalCacheDir dir) → R.text dir

  where
  useGetSpagoGlobalCache ctx = React.do
    result /\ query /\ _reset ← useIPCMessage ctx
    pathʔ /\ setPath ← useStateEq' Nothing
    React.useEffectAlways do
      case result of
        RD.NotAsked → query GetSpagoGlobalCache
        RD.Loading → mempty
        RD.Failure v → absurd v
        RD.Success (GetSpagoGlobalCacheResult (Failed message)) →
          sendNotification ctx $
            errorNotification { title: "Error", body: R.text message }
        RD.Success (GetSpagoGlobalCacheResult (Succeeded path)) → setPath
          (Just path)
        RD.Success msg → sendNotification ctx $
          errorNotification
            { title: "Bug: Wrong Message"
            , body: R.text $ writeJSON msg
            }
      mempty
    pure pathʔ