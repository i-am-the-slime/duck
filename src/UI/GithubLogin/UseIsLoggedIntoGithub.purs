module UI.GithubLogin.UseIsLoggedIntoGithub where

import Yoga.Prelude.View

import Biz.IPC.Message.Types (MessageToMain(..), MessageToRenderer(..))
import Data.Newtype (class Newtype)
import Network.RemoteData as RD
import Partial.Unsafe (unsafePartial)
import React.Basic.Hooks as React
import UI.Ctx.Types (Ctx)
import UI.Hook.UseIPCMessage (UseIPCMessage, useIPCMessage)

newtype UseIsLoggedIntoGithub hook =
  UseIsLoggedIntoGithub (UseIPCMessage hook)

derive instance Newtype (UseIsLoggedIntoGithub hook) _

useIsLoggedIntoGithub ∷
  Ctx →
  Hook UseIsLoggedIntoGithub
    { checkIsLoggedIn ∷ Effect Unit
    , isLoggedIn ∷ Boolean
    , resetCheckIsLoggedIn ∷ Effect Unit
    }
useIsLoggedIntoGithub ctx = coerceHook React.do
  { data: msg, send, reset } ← useIPCMessage ctx
  let checkIsLoggedIn = send GetIsLoggedIntoGithub
  let
    isLoggedIn = unsafePartial case RD.toMaybe msg of
      Just (GetIsLoggedIntoGithubResult s) → s
      Nothing → false
  pure { isLoggedIn, checkIsLoggedIn, resetCheckIsLoggedIn: reset }
