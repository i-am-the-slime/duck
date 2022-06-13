module UI.Start where

import Yoga.Prelude.View

import UI.Component as UI
import UI.Container (container)
import UI.OpenProject as OpenProject

mkView :: UI.Component Unit
mkView = do
  openProjectView <- OpenProject.mkView
  UI.component "StartView" \_ _ -> React.do
    pure $ container [ openProjectView unit ]