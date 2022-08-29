module UI.Hook.UseIPC where

import Prelude

import Biz.IPC.Message.Types (MessageToMain, MessageToRenderer)
import Data.Bifunctor (lmap)
import Data.Either (Either(..), note)
import Data.Foldable (for_)
import Data.Lens (Prism', preview)
import Data.Map (Map)
import Data.Map as Map
import Data.Newtype (class Newtype)
import Data.UUID (UUID, genUUID)
import Effect (Effect)
import Effect.AVar (AVar)
import Effect.AVar as AVar
import Effect.Aff (Aff, attempt, launchAff_)
import Effect.Aff.AVar as AffAVar
import Effect.Class (liftEffect)
import Effect.Ref (Ref)
import Effect.Ref as Ref
import ElectronAPI (ElectronListener)
import ElectronAPI as ElectronAPI
import Foreign (MultipleErrors)
import Network.RemoteData (RemoteData)
import Network.RemoteData as RemoteData
import React.Basic.Hooks (Hook, coerceHook)
import React.Basic.Hooks as React
import UI.Hook.UseRemoteData (UseRemoteData(..), useRemoteData)
import Unsafe.Coerce (unsafeCoerce)
import Yoga.JSON as JSON

type WrappedResponse =
  { response_for_message_id ∷ String
  , response ∷ MessageToRenderer
  , isPartial ∷ Boolean
  }

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

type X = { isPartial ∷ Boolean, response ∷ MessageToRenderer }
type Stream =
  MessageToMain →
  (MessageToRenderer → Effect Unit) →
  Aff Unit

mkStreamIPCMessage ∷
  { registerListener ∷ ElectronListener → Effect (Effect Unit)
  , postMessage ∷ UUID → MessageToMain → Effect Unit
  } →
  Effect
    { stream ∷ Stream
    , destroy ∷ Effect Unit
    }
mkStreamIPCMessage { registerListener, postMessage } = do
  requestsRef ∷ Ref (Map UUID (AVar (X))) ← Ref.new Map.empty
  listener ∷ ElectronListener ← ElectronAPI.mkListener $ \foreignMessage → do
    let
      messageOrError ∷ Either MultipleErrors WrappedResponse
      messageOrError = JSON.read foreignMessage
    for_ messageOrError \msg → do
      let uuid = unsafeCoerce msg.response_for_message_id
      requests ← Ref.read requestsRef
      let requestVarʔ = Map.lookup uuid requests
      for_ requestVarʔ \requestVar → do
        launchAff_ $ AffAVar.put
          ({ isPartial: msg.isPartial, response: msg.response } ∷ X)
          requestVar

  destroy ← registerListener listener
  let
    stream ∷ Stream
    stream msg onUpdate = do
      uuid ← genUUID # liftEffect
      resultAVar ← AffAVar.empty
      postMessage uuid msg # liftEffect
      let
        go = do
          res ∷ X ← AffAVar.take resultAVar
          onUpdate res.response # liftEffect
          if res.isPartial then go
          else do
            Ref.modify_ (Map.delete uuid) requestsRef # liftEffect
      Ref.modify_ (Map.insert uuid resultAVar) requestsRef # liftEffect
      go
  pure { stream, destroy }

useIPC ∷
  ∀ ctx a.
  { sendIPCMessage ∷ MessageToMain → Aff MessageToRenderer | ctx } →
  Prism' MessageToRenderer a →
  Hook UseIPC
    { data ∷ (RemoteData String a)
    , send ∷ (MessageToMain → Effect Unit)
    , reset ∷ Effect Unit
    }
useIPC { sendIPCMessage } prism = coerceHook $ React.do
  let
    send ∷ MessageToMain → Aff (Either String MessageToRenderer)
    send msg = attempt (sendIPCMessage msg) <#> lmap show
  { data: msgData, load, reset } ← useRemoteData send
  let
    remoteData = msgData >>= preview prism >>> note "Wrong message type" >>>
      RemoteData.fromEither

  pure { data: remoteData, send: load, reset }

newtype UseIPC hooks = UseIPC
  (UseRemoteData MessageToMain String MessageToRenderer hooks)

derive instance Newtype (UseIPC hooks) _

useStreamIPC ∷
  ∀ ctx a.
  { streamIPCMessage ∷ Stream
  | ctx
  } →
  Prism' MessageToRenderer a →
  Hook UseStreamIPC
    { stream ∷ Stream
    }
useStreamIPC { streamIPCMessage } prism = coerceHook $ React.do
  let
    stream ∷ Stream
    stream = streamIPCMessage

  pure { stream }

newtype UseStreamIPC hooks = UseStreamIPC
  (hooks)

derive instance Newtype (UseStreamIPC hooks) _
