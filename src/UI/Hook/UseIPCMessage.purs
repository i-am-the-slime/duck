module UI.Hook.UseIPCMessage where

import Prelude

import Biz.IPC.Message.Types (MainToRendererChannel, MessageToMain, MessageToRenderer, RendererToMainChannel)
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
import Yoga.JSON as JSON

useIPCMessage ∷
  Ctx →
  RendererToMainChannel →
  MainToRendererChannel →
  Hook (UseIPCMessage MessageToRenderer)
    ( (MessageToMain → Effect Unit) /\
        (RemoteData MultipleErrors MessageToRenderer)
    )
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