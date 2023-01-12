module UI.GithubLogin.UseIsLoggedIntoGithub where

import Yoga.Prelude.View

import Biz.IPC.Message.Types (MessageToMain(..))
import Data.Lens.Barlow (barlow)
import Data.Newtype (class Newtype)
import Network.RemoteData as RD
import React.Basic.Hooks as React
import Type.Prelude (Proxy(..))
import UI.Ctx.Types (Ctx)
import UI.Hook.UseIPC (UseIPC, useIPC)

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
  { data: msg, send, reset } ← useIPC ctx
    (barlow (Proxy ∷ Proxy ("%GetIsLoggedIntoGithubResult")))
  let
    checkIsLoggedIn = send GetIsLoggedIntoGithub
    isLoggedIn = RD.toMaybe msg # fromMaybe false
  pure { isLoggedIn, checkIsLoggedIn, resetCheckIsLoggedIn: reset }
