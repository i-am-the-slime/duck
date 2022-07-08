module UI.Preferences where

import Yoga.Prelude.View

import UI.Component as UI
import UI.Navigation.Router.Page.Preferences as Preferences
import UI.Preferences.Root as PreferencesRoot
import UI.Tool.Spago as Spago

mkView ∷ UI.Component (Preferences.Route)
mkView = do
  rootView ← PreferencesRoot.mkView
  spagoView ← Spago.mkView
  UI.component "Preferences" \_ route → React.do
    pure case route of
      Preferences.Root → rootView unit
      Preferences.Spago → spagoView unit
