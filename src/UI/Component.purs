module UI.Component where

import Prelude

import Control.Monad.Reader.Trans (ask)
import Effect (Effect)
import Effect.Class (liftEffect)
import React.Basic (JSX)
import React.Basic.Hooks as Hooks
import React.Basic.Hooks as React
import Uncurried.ReaderT (ReaderT, runReaderT)
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