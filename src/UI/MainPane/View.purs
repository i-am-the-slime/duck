module UI.MainPane.View where

import Yoga.Prelude.View

import React.Basic.Hooks as React
import UI.Component as UI
import UI.Navigation.Router (useRouter)
import UI.Navigation.Router.Types (Route(..))
import UI.OpenProject as OpenProject
import UI.Solutions as Solutions
import UI.Registry as Registry
import UI.Preferences as Preferences

mkView ∷ UI.Component Unit
mkView = do
  openProjectView ← OpenProject.mkView
  solutionsView ← Solutions.mkView
  registry ← Registry.mkView
  preferences ← Preferences.mkView
  UI.component "MainPane" \_ _ → React.do
    { route } ← useRouter
    pure $ case route of
      Home → openProjectView unit
      Solutions → solutionsView unit
      Registry → registry unit
      Preferences subRoute → preferences subRoute