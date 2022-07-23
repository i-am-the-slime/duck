module UI.Navigation.HeaderBar where

import Yoga.Prelude.View

import Biz.Github.Types (Login(..), Repository(..))
import Data.Array as Array
import Fahrtwind (border, borderBottom, borderCol', flexRow, fontSemiMedium, gap, height, heightFull, hover, itemsCenter, justifyBetween, mL, mR, overflowHidden, overflowVisible, pL, pR, pX, pY, positionRelative, textCol', textSm, widthAndHeight)
import Framer.Motion as M
import Plumage.Util.HTML as P
import React.Basic.DOM as R
import React.Basic.Emotion as E
import React.Basic.Hooks as React
import UI.Component as UI
import UI.Navigation.HeaderBar.GithubAvatar as GithubAvatar
import UI.Navigation.Router (printRoute, useRouter)
import UI.Navigation.Router.Page.Github as Github
import UI.Navigation.Router.Page.Preferences as Preferences
import UI.Navigation.Router.Types (Route(..))
import UI.Style (toolbarBackground, toolbarBorderCol)
import Yoga.Block.Container.Style (col, colour)

mkView ∷ UI.Component Unit
mkView = do
  githubAvatar ← GithubAvatar.mkView
  view ← mkPresentationalView # liftEffect
  UI.component "HeaderBar" \_ _ → React.do
    { route } ← useRouter
    pure $ view { route, topRight: Just (githubAvatar unit) }

mkPresentationalView ∷
  React.Component { route ∷ Route, topRight ∷ Maybe JSX }
mkPresentationalView = do
  React.component "HeaderBarPresentational" \{ route, topRight } → React.do
    React.do
      pure $
        P.div "header-bar"
          ( flexRow <> gap 8 <> justifyBetween <> itemsCenter
              <> toolbarBackground
              <> heightFull
              <> borderBottom 1
              <> toolbarBorderCol
              <> fontSemiMedium
              <> textCol' col.textPaler1
              <> textSm
              <> pY 12
              <> pX 24
              <>
                E.css
                  { containerType: E.str "inline-size"
                  , containerName: E.str "breadcrumbs"
                  , overflow: E.str "auto"
                  , minWidth: E.str "150px"
                  , maxWidth: E.str "100%"
                  }
          )
          [ renderRoute route
          , fold topRight
          ]

renderRoute ∷ Route → JSX
renderRoute route =
  P.div_
    ( E.css
        { "@container breadcrumbs (max-width: 350px)": E.nested $ E.css
            { ".breadcrumb-container > *":
                E.nested $ E.css
                  { display: E.none
                  }
            , ".breadcrumb-container > a:last-of-type, .breadcrumb-container > div:last-of-type":
                E.nested $ E.css
                  { display: E.block
                  }
            }
        }
    ) $ pure
    $ M.div
    </*
      { className: "breadcrumb-container"
      , animate: M.animate $ R.css
          { transition:
              { when: "beforeChildren"
              , staggerChildren: 0.1
              , delayChildren: 0.1
              }
          }
      , css: flexRow <> border 1 <> borderCol' col.backgroundLayer2
          <> overflowHidden
          <> E.css
            { borderRadius: E.str "8px"
            , flexDirection: E.str "row-reverse"
            , "& > a:last-of-type": E.nested $ pL 12 <> mL 0
            , "& > a:first-of-type": E.nested
                ( E.css
                    { "&:after": E.nested $ E.css { content: E.none }
                    }
                    <> pR 12
                    <> mR 0
                    <> E.css
                      { borderRadius: E.str "8px"
                      , "--bg": col.backgroundLayer4
                      }
                )
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
          [ linkTo (Github Github.Root) "Github"
          , link $ owner <> "/" <> repo
          ]
      Preferences subRoute → case subRoute of
        Preferences.Root → [ link "Preferences" ]
        Preferences.Spago →
          [ linkTo (Preferences Preferences.Root) "Preferences"
          , link "Spago"
          ]
  where
  linkStyle = pL 30
    <> pY 3
    <> overflowHidden
    <> height 28
    <> positionRelative
    -- <> border 1
    -- <> borderCol' col.backgroundBright5
    <> mR 18
    <> mL (-26)
    <> overflowVisible
    <> textSm
    <> E.css
      { "--bg": col.backgroundLayer3
      , borderRight: E.str "1px solid var(--bg)"
      , background: E.str "var(--bg)"
      , "&:after": E.nested
          $ E.css
              { content: E.str "''"
              , border: E.str $ "1px solid " <> colour.backgroundLayer2
              , position: E.str "absolute"
              , background: E.str "var(--bg)"
              , overflow: E.visible
              , top: E.str "3px"
              , right: E.str "-11px"
              , borderRadius: E.str "0 3px 0 0"
              , clipPath: E.str "polygon(0 0, 100% 0, 100% 100%)"
              , transform: E.str "rotate(45deg)"
              }
          <> widthAndHeight 22
      }
    <> hover (E.css { "--bg": col.backgroundBright3 })
  linkTo r child = R.a'
    </* { className: "route-link", css: linkStyle, href: printRoute r }
    /> [ R.text child ]
  link = linkTo route
