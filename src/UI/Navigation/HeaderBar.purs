module UI.Navigation.HeaderBar where

import Yoga.Prelude.View

import Biz.Github.Types (Login(..), Repository(..))
import Data.Array as Array
import Debug (spy)
import Fahrtwind (widthAndHeight)
import Fahrtwind.Icon.Heroicons as Heroicon
import Framer.Motion as M
import Plumage.Util.HTML as P
import React.Basic.DOM as R
import React.Basic.Hooks as React
import UI.Component as UI
import UI.Navigation.HeaderBar.GithubAvatar as GithubAvatar
import UI.Navigation.HeaderBar.Style as Style
import UI.Navigation.Router (printRoute, useRouter)
import UI.Navigation.Router.Page.Github as Github
import UI.Navigation.Router.Page.Preferences as Preferences
import UI.Navigation.Router.Types (Route(..))
import Yoga.Block.Hook.UseOverflows (useOverflows)
import Yoga.Block.Hook.UseStateEq (useStateEq')

mkView ∷ UI.Component Unit
mkView = do
  githubAvatar ← GithubAvatar.mkView
  view ← mkPresentationalView # liftEffect
  UI.component "HeaderBar" \_ _ → React.do
    { route } ← useRouter
    pure $ view { route, topRight: Just (githubAvatar unit) }

mkPresentationalView ∷ React.Component { route ∷ Route, topRight ∷ Maybe JSX }
mkPresentationalView = do
  routeView ← mkRouteView
  React.component "HeaderBarPresentational" \{ route, topRight } → React.do
    pure $
      P.div "header-bar" Style.headerBar
        [ routeView route
        , fold topRight
        ]

mkRouteView ∷ React.Component Route
mkRouteView = React.component "HeaderBarRoute" \route → React.do
  let link = linkTo route
  breadcrumb ← useOverflows
  showDots /\ setShowDots ← useStateEq' Nothing

  useEffect route do
    setShowDots Nothing
    mempty

  useEffect breadcrumb.xOverflows do
    let _ = spy "xoverflows" breadcrumb.xOverflows
    if (showDots == Just route) then do
      unless (breadcrumb.xOverflows) $ setShowDots Nothing
    else when (breadcrumb.xOverflows) do
      setShowDots (Just route)
    mempty

  pure $ R.div'
    </* { css: Style.breadcrumbContainerWrapper, ref: breadcrumb.ref }
    /> pure
    $ M.div
    </*
      { className: "breadcrumb-container"
      , css: Style.breadcrumbContainer
      , animate: M.animate $ R.css
          { transition:
              { when: "beforeChildren"
              , staggerChildren: 0.1
              , delayChildren: 0.1
              }
          }
      }
    /> Array.reverse case route of
      Home → [ link "Home" ]
      Solutions → [ link "Solutions" ]
      Worksheet → [ link "Worksheet" ]
      Registry → [ link "Registry" ]
      Github subRoute → case subRoute of
        Github.Root → [ link "Github" ]
        Github.Repository (Login owner) (Repository repo) →
          [ if showDots # isJust then
              R.a' </* { css: Style.link } />
                [ P.div_ Style.dots [ Heroicon.dotsHorizontal ] ]
            else fragment
              [ linkTo (Github Github.Root) "Github"
              , linkTo (Github Github.Root) owner -- [FIXME] Dedicated page
              ]
          , link repo
          ]
      Preferences subRoute → case subRoute of
        Preferences.Root → [ link "Preferences" ]
        Preferences.Spago →
          [ linkTo (Preferences Preferences.Root) "Preferences"
          , link "Spago"
          ]
  where
  linkTo r child = R.a'
    </*
      { className: "route-link"
      , css: Style.link
      , href: printRoute r
      }
    /> [ R.text child ]
