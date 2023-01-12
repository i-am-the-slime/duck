module UI.Start where

import Yoga.Prelude.View

import Control.Monad.Reader.Class (ask)
import Fahrtwind (height, height', heightFull, mL, mT, overflowHidden, positionFixed, width')
import Fahrtwind as F
import React.Basic.Emotion as E
import UI.Component as UI
import UI.Container (mkContainer, ourGlobalStyle)
import UI.MainPane.View as MainPane
import UI.HeaderBar.Style (headerBarHeight)
import UI.Navigation.HeaderBar as HeaderBar
import UI.Navigation.Router (mkRouter)
import UI.Navigation.SideBar as SideBar
import UI.Navigation.ThemeSwitcher (mkThemeProvider)
import Yoga.Prelude.View as P

mkView ∷ UI.Component Unit
mkView = do
  { notificationCentre } ← ask
  router ← mkRouter # liftEffect
  themeProvider ← mkThemeProvider ourGlobalStyle # liftEffect
  container ← mkContainer notificationCentre # liftEffect
  headerBar ← HeaderBar.mkView
  sideBar ← SideBar.mkView
  mainPane ← MainPane.mkView
  UI.component "MainWindow" \_ _ → React.do
    pure $ router $ themeProvider
      $ container
      $
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
                <> overflowHidden
                <> mT headerBarHeight
                <> mL 72
            )
            [ mainPane unit ]

        ]
