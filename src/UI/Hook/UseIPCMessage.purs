module UI.Hook.UseIPCMessage where

import Prelude

import Biz.IPC.Message.Types (MainToRendererChannel, RendererToMainChannel)
import Data.Newtype (class Newtype)
import Data.Tuple.Nested (type (/\), (/\))
import Effect (Effect)
import ElectronAPI as ElectronAPI
import Foreign (MultipleErrors)
import Network.RemoteData (RemoteData(..))
import Network.RemoteData as RemoteData
import React.Basic.Hooks (Hook, UseEffect, UseState, coerceHook, useEffectOnce)
import React.Basic.Hooks as React
import UI.Component (Ctx)
import Yoga.JSON (class ReadForeign, class WriteForeign)
import Yoga.JSON as JSON

useIPCMessage ∷
  ∀ i o.
  WriteForeign i ⇒
  ReadForeign o ⇒
  Ctx →
  RendererToMainChannel →
  MainToRendererChannel →
  Hook (UseIPCMessage o)
    ((i → Effect Unit) /\ (RemoteData MultipleErrors o))
useIPCMessage
  { registerListener, removeListener, postMessage }
  toChannel
  fromChannel = coerceHook $ React.do
  result /\ setResult ← React.useState' NotAsked
  useEffectOnce do
    listener ← ElectronAPI.mkListener $ \_ foreignMessage → do
      let messageOrError = JSON.read foreignMessage
      messageOrError # (setResult <<< RemoteData.fromEither)
    registerListener fromChannel listener
    pure $ removeListener fromChannel listener
  let send msg = setResult Loading *> postMessage toChannel (JSON.write msg)
  pure (send /\ result)

newtype UseIPCMessage o hooks = UseIPCMessage
  (UseEffect Unit (UseState (RemoteData MultipleErrors o) hooks))

derive instance Newtype (UseIPCMessage o hooks) _
-- useIPCMessage ∷
--   ∀ i o.
--   WriteForeign i ⇒
--   ReadForeign o ⇒
--   Ctx →
--   Channel →
--   Channel →
--   Hook (UseIPCMessage o)
--     ((i → Effect Unit) /\ (RemoteData MultipleErrors o))
-- useIPCMessage
--   { registerListener, removeListener, postMessage }
--   toChannel
--   fromChannel = coerceHook $
--   React.do
--     result /\ setResult ← React.useState' NotAsked
--     useEffectOnce do
--       listener ← ElectronAPI.mkListener $ \_ foreignMessage → do
--         let messageOrError = JSON.read foreignMessage
--         messageOrError # (setResult <<< RemoteData.fromEither)
--       registerListener fromChannel listener
--       pure $ removeListener fromChannel listener
--     let
--       send msg = setResult Loading *> postMessage toChannel (JSON.write msg)
--     pure (send /\ result)

-- newtype UseIPCMessage o hooks = UseIPCMessage
--   (UseEffect Unit (UseState (RemoteData MultipleErrors o) hooks))

-- derive instance Newtype (UseIPCMessage o hooks) _