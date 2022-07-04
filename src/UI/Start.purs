module UI.Start where

import Yoga.Prelude.View

import Control.Monad.Reader.Class (ask)
import Fahrtwind (heightFull)
import React.Basic.Emotion as E
import UI.Component as UI
import UI.Container (mkContainer)
import UI.MainPane.View as MainPane
import UI.Navigation.HeaderBar as HeaderBar
import UI.Navigation.Router (mkRouter)
import UI.Navigation.SideBar as SideBar
import Yoga.Block as Block

mkView ∷ UI.Component Unit
mkView = do
  { notificationCentre } ← ask
  router ← mkRouter # liftEffect
  container ← mkContainer notificationCentre # liftEffect
  headerBar ← HeaderBar.mkView
  sideBar ← SideBar.mkView
  mainPane ← MainPane.mkView
  UI.component "MainWindow" \_ _ → React.do
    pure $ router $ container
      [ Block.sidebar
          { space: "0", sidebar: sideBar unit }
          [ Block.stack { css: heightFull, space: E.str "0" }
              [ headerBar unit
              , mainPane unit
              ]
          ]
      ]