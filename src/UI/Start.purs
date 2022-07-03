module UI.Start where

import Yoga.Prelude.View

import Control.Monad.Reader.Class (ask)
import React.Basic.Hooks as React
import UI.Component as UI
import UI.Container (mkContainer)
import UI.GithubLogin (mkGithubLogin)
import UI.GithubLogin.UseGithubToken (useGithubToken)
import UI.OpenProject as OpenProject
import UI.Registry as Registry

mkView ∷ UI.Component Unit
mkView = do
  { notificationCentre } ← ask
  openProjectView ← OpenProject.mkView
  container ← mkContainer notificationCentre # liftEffect
  registry ← Registry.mkView
  githubLogin ← mkGithubLogin
  UI.component "StartView" \_ _ → React.do
    tokenʔ /\ setToken ← useGithubToken
    pure $ container
      [ githubLogin { setToken, tokenʔ }
      , registry unit
      ]