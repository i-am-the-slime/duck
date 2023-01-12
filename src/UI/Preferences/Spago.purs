module UI.Tool.Spago where

import Backend.Tool.Spago.Types (SpagoGlobalCacheDir(..))
import Biz.IPC.Message.Types (MessageToMain(..))
import Data.Either (Either(..))
import Data.Lens.Barlow (barlow)
import Network.RemoteData as RD
import React.Basic.DOM as R
import React.Basic.Hooks as React
import Type.Prelude (Proxy(..))
import UI.Component as UI
import UI.Hook.UseIPC (useIPC)
import UI.Notification.ErrorNotification (errorNotification)
import UI.Notification.SendNotification (sendNotification)
import Yoga.Block.Hook.UseStateEq (useStateEq')
import Yoga.Prelude.View (Maybe(..), Unit, discard, foldMap, mempty, pure, (#), ($), (/\))

mkView ∷ UI.Component Unit
mkView = do
  UI.component "SpagoInfo" \ctx _ → React.do
    cacheDirʔ ← useGetSpagoGlobalCache ctx
    pure $ cacheDirʔ # foldMap \(SpagoGlobalCacheDir dir) → R.text dir

  where
  useGetSpagoGlobalCache ctx = React.do
    { data: result, send: query } ← useIPC ctx
      (barlow (Proxy ∷ Proxy ("%GetSpagoGlobalCacheResult")))
    pathʔ /\ setPath ← useStateEq' Nothing
    React.useEffectAlways do
      case result of
        RD.NotAsked → query GetSpagoGlobalCache
        RD.Loading → mempty
        RD.Failure err →
          sendNotification ctx $
            errorNotification { title: "Error", body: R.text err }
        RD.Success (Left message) →
          sendNotification ctx $
            errorNotification { title: "Error", body: R.text message }
        RD.Success (Right path) → setPath
          (Just path)
      mempty
    pure pathʔ
