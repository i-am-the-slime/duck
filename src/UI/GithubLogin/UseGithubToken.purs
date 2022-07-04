module UI.GithubLogin.UseGithubToken where

import Yoga.Prelude.View

import Biz.OAuth.Types (GithubAccessToken)
import Data.Newtype (class Newtype)
import React.Basic.Hooks as React
import Web.HTML (window)
import Web.HTML.Window (localStorage)
import Web.Storage.Storage as LS
import Yoga.JSON (writeJSON)
import Yoga.JSON as JSON

newtype UseGithubToken hooks = UseGithubToken
  ( UseEffect (Maybe GithubAccessToken)
      ( UseEffect Unit
          ( UseState
              (Maybe GithubAccessToken)
              hooks
          )
      )
  )

derive instance Newtype (UseGithubToken hooks) _

useGithubToken ∷
  Hook UseGithubToken
    ((Maybe GithubAccessToken) /\ (Maybe GithubAccessToken → Effect Unit))
useGithubToken = coerceHook React.do
  accessTokenʔ /\ setAccessToken ← React.useState' Nothing
  useEffectAlways do
    storedʔ ← storedToken.read
    when (storedʔ /= accessTokenʔ && (storedʔ # isJust)) do
      setAccessToken storedʔ
    mempty
  -- Sync with local storage
  useEffect accessTokenʔ do
    storedʔ ← storedToken.read
    unless (storedʔ == accessTokenʔ) do
      storedToken.write accessTokenʔ
    mempty
  pure (accessTokenʔ /\ setAccessToken)

storedToken ∷
  { read ∷ Effect (Maybe GithubAccessToken)
  , write ∷ Maybe GithubAccessToken → Effect Unit
  }
storedToken =
  { read
  , write
  }
  where
  ls = window >>= localStorage
  item = "github-token"
  read = ls >>= LS.getItem item <#> (_ >>= JSON.readJSON_)
  write = case _ of
    Nothing → ls >>= LS.removeItem item
    Just token → ls >>= LS.setItem item (writeJSON token)
