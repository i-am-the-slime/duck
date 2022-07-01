module Backend.Protocol where

import Prelude

import Biz.Protocol (duckProtocol)
import Effect (Effect)
import Effect.Class (liftEffect)
import Electron (isDefaultProtocolClient, setAsDefaultProtocolClient)
import Partial.Unsafe (unsafeCrashWith)

registerProtocol ∷ Effect Unit
registerProtocol = do
  protocolIsRegistered ← isDefaultProtocolClient duckProtocol # liftEffect
  unless protocolIsRegistered do
    registeredNow ← setAsDefaultProtocolClient duckProtocol
    unless registeredNow do
      unsafeCrashWith $ "Failed to set " <> show duckProtocol <>
        " to be handled by this application"
