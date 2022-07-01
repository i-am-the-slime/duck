module UI.Start where

import Yoga.Prelude.View

import Control.Monad.Reader.Class (ask)
import Debug (spy)
import UI.Component as UI
import UI.Container (mkContainer)
import UI.GithubLogin (mkGithubLogin)
import UI.OpenProject as OpenProject

mkView ∷ UI.Component Unit
mkView = do
  { notificationCentre } ← ask
  openProjectView ← OpenProject.mkView
  container ← mkContainer notificationCentre # liftEffect
  githubLogin ← mkGithubLogin
  UI.component "StartView" \_ _ → React.do
    pure $ container
      [ githubLogin
          { onLoggedIn: \t → do
              let _ = spy "token" t
              mempty
          }
      ]