module UI.Component where

import Prelude

import Biz.IPC.Message.Types (MessageToMain)
import Control.Monad.Reader.Trans (ask)
import Data.UUID (UUID)
import Effect (Effect)
import Effect.Class (liftEffect)
import ElectronAPI (ElectronListener)
import React.Basic (JSX)
import React.Basic.Hooks as Hooks
import React.Basic.Hooks as React
import UI.GithubLogin.Repository (GetDeviceCode, PollAccessToken)
import Uncurried.ReaderT (ReaderT, runReaderT)
import Yoga.Block.Organism.NotificationCentre.Types (NotificationCentre)
import UI.Ctx.Types (Ctx)

type ComponentM = ReaderT Ctx Effect
type Component props = ReaderT Ctx Effect (props → JSX)

runComponent ∷ ∀ a. Ctx → ComponentM a → Effect a
runComponent = runReaderT

component ∷
  ∀ hooks props.
  String →
  (Ctx → props → Hooks.Render Unit hooks JSX) →
  Component props
component name render =
  ask >>= render >>> React.component name >>> liftEffect