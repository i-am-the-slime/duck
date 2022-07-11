module UI.MainPane.Style where

import Yoga.Prelude.Style

import UI.HeaderBar.Style (headerBarHeight)

mainViewHeight ∷ StyleProperty
mainViewHeight =
  str ("calc(100vh - " <> show headerBarHeight <> "px)")
