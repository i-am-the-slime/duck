module UI.Component where

import Prelude

import Control.Monad.Reader.Trans (ask)
import Effect (Effect)
import Effect.Class (liftEffect)
import Electron.Types (Channel)
import ElectronAPI (ElectronListener)
import Foreign (Foreign)
import React.Basic (JSX)
import React.Basic.Hooks as Hooks
import React.Basic.Hooks as React
import Uncurried.ReaderT (ReaderT, runReaderT)

type Ctx =
  { registerListener :: Channel -> ElectronListener -> Effect Unit
  , removeListener :: Channel -> ElectronListener -> Effect Unit
  , postMessage :: Channel -> Foreign -> Effect Unit
  }

type ComponentM = ReaderT Ctx Effect
type Component props = ReaderT Ctx Effect (props -> JSX)

runComponent :: forall a. Ctx -> ComponentM a -> Effect a
runComponent = runReaderT

component
  :: forall hooks props
   . String
  -> (Ctx -> props -> Hooks.Render Unit hooks JSX)
  -> Component props
component name render = do
  ctx <- ask
  liftEffect $
    React.component name (render ctx)