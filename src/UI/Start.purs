module UI.Start where

import Yoga.Prelude.View

import Control.Monad.Reader.Class (ask)
import Fahrtwind (background, background', flexCol, flexGrow, full, green, height, height', heightFull, mL, mT, minHeight', pT, pink, positionAbsolute, positionFixed, screenHeight, width')
import Fahrtwind as F
import Plumage.Util.HTML as P
import React.Basic.Emotion as E
import UI.Component as UI
import UI.Container (mkContainer)
import UI.MainPane.View as MainPane
import UI.Navigation.HeaderBar (headerBarHeight)
import UI.Navigation.HeaderBar as HeaderBar
import UI.Navigation.Router (mkRouter)
import UI.Navigation.SideBar as SideBar

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
      [ P.div_
          ( positionFixed
              <> F.width 72
              <> heightFull
              <> F.left 0
              <> F.top 0
          )
          [ sideBar unit ]
      , P.div_
          ( positionFixed
              <> width' (E.str "calc(100% - 72px)")
              <> height headerBarHeight
              <> F.right 0
              <> F.top 0
          )
          [ headerBar unit ]
      , P.div_
          ( height' (E.str $ "calc(100vh - " <> show headerBarHeight <> "px)")
              <> mT headerBarHeight
              <> mL 72
          )
          [ mainPane unit ]

      ]
