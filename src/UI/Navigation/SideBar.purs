module UI.Navigation.SideBar where

import Yoga.Prelude.View

import Data.Enum (enumFromTo)
import Fahrtwind (borderRight, heightScreen, pX, pXY, pY, widthAndHeight)
import Fahrtwind.Icon.Heroicons as Heroicon
import Foreign.Object as Object
import Prelude as Bounded
import React.Basic.Emotion as E
import React.Basic.Hooks as React
import UI.Component as UI
import UI.GithubLogin.GithubLogo (githubLogo)
import UI.Navigation.Router (useRouter)
import UI.Navigation.Router.Page.Github as Github
import UI.Navigation.Router.Page.Preferences as PreferencesRoute
import UI.Navigation.Router.Types (Route(..), TopLevelRoute(..), toTopLevelRoute)
import UI.Style (toolbarBackground, toolbarBorderCol, toolbarButtonStyle, toolbarRippleCol)
import Yoga.Block as Block

mkView ∷ UI.Component Unit
mkView = do
  view ← mkPresentationalView # liftEffect
  UI.component "SideBar" \{} _ → React.do
    { route, navigate } ← useRouter
    pure $ view (route /\ navigate)

mkPresentationalView ∷ React.Component (Route /\ (Route → Effect Unit))
mkPresentationalView =
  React.component "HeaderBarPresentational" \props → React.do
    pure $ Block.stack
      { space: E.str "16px"
      , splitAfter: 4
      , css:
          toolbarBackground <> borderRight 1
            <> toolbarBorderCol
            <> pY 12
            <> pX 8
            <> heightScreen
            <> E.css { width: E.str "fit-content" }
      }
      (renderLinks props)

renderLinks ∷ (Route /\ (Route → Effect Unit)) → Array JSX
renderLinks (currentRoute /\ setRoute) =
  allTopLevelRoutes <#> renderTopLevelRoute
  where
  allTopLevelRoutes = enumFromTo Bounded.bottom Bounded.top
  iconButton tlr target svg = do
    let isCurrent = tlr == current
    Block.button
      { _aria: Object.fromHomogeneous { "pressed": show isCurrent }
      , onClick: handler_ (unless isCurrent $ setRoute target)
      , css: toolbarButtonStyle <> widthAndHeight 56 <> pXY 12
      , ripple: toolbarRippleCol
      }
      [ svg ]
  current = toTopLevelRoute currentRoute
  renderTopLevelRoute tlr = case tlr of
    TopLevelHome → iconButton tlr Home Heroicon.home
    TopLevelSolutions → iconButton tlr Solutions Heroicon.code
    TopLevelRegistry → iconButton tlr Registry Heroicon.identification
    TopLevelGithub → iconButton tlr (Github Github.Root) githubLogo
    TopLevelPreferences → iconButton tlr (Preferences PreferencesRoute.Root)
      Heroicon.cog
