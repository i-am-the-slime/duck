module UI.MainPane.View where

import Yoga.Prelude.View

import React.Basic.Hooks as React
import UI.Component as UI
import UI.Github as Github
import UI.Navigation.Router (useRouter)
import UI.Navigation.Router.Types (Route(..))
import UI.OpenProject as OpenProject
import UI.Preferences as Preferences
import UI.Registry as Registry
import UI.Solutions as Solutions
import UI.Worksheet.View as Worksheet

mkView ∷ UI.Component Unit
mkView = do
  openProjectView ← OpenProject.mkView
  solutionsView ← Solutions.mkView
  worksheetView ← Worksheet.mkView
  registry ← Registry.mkView
  github ← Github.mkView
  preferences ← Preferences.mkView
  UI.component "MainPane" \_ _ → React.do
    { route } ← useRouter
    pure $ case route of
      Home → openProjectView unit
      Solutions → solutionsView unit
      Worksheet → worksheetView unit
      Registry → registry unit
      Github subRoute → github subRoute
      Preferences subRoute → preferences subRoute
