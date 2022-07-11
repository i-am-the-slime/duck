module UI.Hook.UseIPCMessage where

import Prelude

import Biz.IPC.Message.Types (MessageToMain, MessageToRenderer)
import Data.Either (Either(..))
import Data.Foldable (for_)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.Tuple.Nested (type (/\), (/\))
import Data.UUID (UUID, genUUID)
import Data.UUID as UUID
import Effect (Effect)
import Effect.Class.Console as Console
import Effect.Ref (Ref)
import Effect.Ref as Ref
import Effect.Unsafe (unsafePerformEffect)
import ElectronAPI as ElectronAPI
import Foreign.Internal.Stringify (unsafeStringify)
import Network.RemoteData (RemoteData(..))
import Network.RemoteData as RD
import React.Basic.Hooks (Hook, UseEffect, UseState, coerceHook, useEffectOnce)
import React.Basic.Hooks as React
import UI.Ctx.Types (Ctx)
import Yoga.JSON as JSON

useIPCMessage ∷
  Ctx →
  Hook UseIPCMessage
    ( (RemoteData Void MessageToRenderer)
        /\ (MessageToMain → Effect Unit)
        /\ Effect Unit
    )
useIPCMessage
  { registerListener, postMessage } = coerceHook $ React.do
  result /\ setResult ← React.useState' NotAsked
  inFlightMessageIDRef /\ _ ← React.useState'
    (unsafePerformEffect (Ref.new Nothing))
  let
    reset = do
      Ref.write Nothing inFlightMessageIDRef
      setResult NotAsked
  useEffectOnce do
    listener ← ElectronAPI.mkListener $ \foreignMessage → do
      -- let _ = spy "foreignmessage" foreignMessage
      currentMessageIDʔ ← Ref.read inFlightMessageIDRef
      for_ currentMessageIDʔ \id → do
        let
          expectedID = UUID.toString id

          messageOrError ∷
            _ _
              { response_for_message_id ∷ String, response ∷ MessageToRenderer }
          messageOrError = JSON.read foreignMessage
        case messageOrError of
          Left err →
            Console.error $ "Failed decoding IPC message: " <> unsafeStringify
              foreignMessage
          Right { response_for_message_id, response }
            | response_for_message_id == expectedID →
                (setResult $ RD.Success response)
          _ → mempty
    registerListener listener
  let
    send msg = do
      setResult Loading
      uuid ← genUUID
      Ref.write (Just uuid) inFlightMessageIDRef
      postMessage uuid msg
  pure (result /\ send /\ reset)

newtype UseIPCMessage hooks = UseIPCMessage
  ( UseEffect Unit
      ( UseState (Ref (Maybe UUID))
          (UseState (RemoteData Void MessageToRenderer) hooks)
      )
  )

derive instance Newtype (UseIPCMessage hooks) _