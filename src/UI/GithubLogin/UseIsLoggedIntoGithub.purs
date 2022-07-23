module UI.GithubLogin.UseIsLoggedIntoGithub where

import Yoga.Prelude.View

import Biz.IPC.Message.Types (MessageToMain(..), MessageToRenderer(..))
import Data.Lens.Barlow (barlow)
import Data.Newtype (class Newtype)
import Network.RemoteData as RD
import Partial.Unsafe (unsafePartial)
import React.Basic.Hooks as React
import UI.Ctx.Types (Ctx)
import UI.Hook.UseIPCMessage (UseIPC, useIPC)

newtype UseIsLoggedIntoGithub hook =
  UseIsLoggedIntoGithub (UseIPC hook)

derive instance Newtype (UseIsLoggedIntoGithub hook) _

useIsLoggedIntoGithub ∷
  Ctx →
  Hook UseIsLoggedIntoGithub
    { checkIsLoggedIn ∷ Effect Unit
    , isLoggedIn ∷ Boolean
    , resetCheckIsLoggedIn ∷ Effect Unit
    }
useIsLoggedIntoGithub ctx = coerceHook React.do
  { data: msg, send, reset } ← useIPC ctx (barlow @"%GetIsLoggedIntoGithubResult")
  let
    checkIsLoggedIn = send GetIsLoggedIntoGithub
    isLoggedIn = RD.toMaybe msg # fromMaybe false
  pure { isLoggedIn, checkIsLoggedIn, resetCheckIsLoggedIn: reset }
