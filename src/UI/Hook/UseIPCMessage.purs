module UI.Hook.UseIPCMessage where

import Prelude

import Biz.IPC.Message.Types (MessageToMain, MessageToRenderer)
import Data.Either (Either(..))
import Data.Foldable (for_)
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.Tuple.Nested ((/\))
import Data.UUID (UUID, genUUID)
import Data.UUID as UUID
import Effect (Effect)
import Effect.AVar (AVar)
import Effect.AVar as AVar
import Effect.Aff (Aff)
import Effect.Aff.AVar as AffAVar
import Effect.Class (liftEffect)
import Effect.Class.Console as Console
import Effect.Ref (Ref)
import Effect.Ref as Ref
import Effect.Unsafe (unsafePerformEffect)
import ElectronAPI (ElectronListener)
import ElectronAPI as ElectronAPI
import Foreign (MultipleErrors)
import Foreign.Internal.Stringify (unsafeStringify)
import Network.RemoteData (RemoteData(..))
import Network.RemoteData as RD
import React.Basic.Hooks (Hook, UseEffect, UseState, coerceHook, useEffectOnce)
import React.Basic.Hooks as React
import UI.Ctx.Types (Ctx)
import UI.Hook.UseRemoteData (UseRemoteData(..), useRemoteData)
import Unsafe.Coerce (unsafeCoerce)
import Yoga.JSON as JSON

type WrappedResponse =
  { response_for_message_id ∷ String, response ∷ MessageToRenderer }

mkSendIPCMessage ∷
  { registerListener ∷ ElectronListener → Effect (Effect Unit)
  , postMessage ∷ UUID → MessageToMain → Effect Unit
  } →
  Effect
    { send ∷ MessageToMain → Aff MessageToRenderer
    , destroy ∷ Effect Unit
    }
mkSendIPCMessage { registerListener, postMessage } = do
  requestsRef ∷ Ref (Map UUID (AVar MessageToRenderer)) ← Ref.new Map.empty
  listener ← ElectronAPI.mkListener $ \foreignMessage → do
    let
      messageOrError ∷ Either MultipleErrors WrappedResponse
      messageOrError = JSON.read foreignMessage
    for_ messageOrError \msg → do
      let uuid = unsafeCoerce msg.response_for_message_id
      requests ← Ref.read requestsRef
      let requestʔ = requests # Map.lookup uuid
      for_ requestʔ \request → do
        _putSucceeded ← AVar.tryPut msg.response request
        pure unit

  destroy ← registerListener listener
  let
    send msg = do
      uuid ← genUUID # liftEffect
      resultAVar ← AffAVar.empty
      Ref.modify_ (Map.insert uuid resultAVar) requestsRef # liftEffect
      postMessage uuid msg # liftEffect
      AffAVar.read resultAVar
  pure { send, destroy }

useIPCMessage ∷
  Ctx →
  Hook UseIPCMessage
    { data ∷ (RemoteData Void MessageToRenderer)
    , send ∷ (MessageToMain → Effect Unit)
    , reset ∷ Effect Unit
    }
useIPCMessage
  { sendIPCMessage } = coerceHook $ React.do
  { data: datar, load, reset } ← useRemoteData
    (\i → Right <$> sendIPCMessage i)
  pure { data: datar, send: load, reset }

newtype UseIPCMessage hooks = UseIPCMessage
  (UseRemoteData MessageToMain Void MessageToRenderer hooks)

derive instance Newtype (UseIPCMessage hooks) _
