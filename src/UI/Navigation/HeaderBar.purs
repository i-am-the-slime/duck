module UI.Navigation.HeaderBar where

import Fahrtwind (active, background', border, borderBottom, borderCol', divideY, fontSemiMedium, mT, overflowHidden, pX, pY, roundedDefault, roundedFull, textCol', textSm, transform, widthAndHeight)
import Yoga.Prelude.View

import Biz.GraphQL (GraphQL(..))
import Fahrtwind.Icon.Heroicons as Heroicon
import Fahrtwind.Style.Divide (divideCol')
import Network.RemoteData as RD
import Plumage.Atom.PopOver.Types (HookDismissBehaviour(..), Placement(..))
import Plumage.Atom.PopOver.Types as Place
import Plumage.Hooks.UsePopOver (usePopOver)
import Plumage.Util.HTML as P
import React.Basic.DOM as R
import React.Basic.Emotion as E
import React.Basic.Hooks as React
import UI.Component as UI
import UI.Container (popOverId)
import UI.GithubLogin (mkGithubLogin)
import UI.GithubLogin.UseGithubGraphQL (useGithubGraphQL)
import UI.GithubLogin.UseGithubToken (useGithubToken)
import UI.Navigation.Router (useRouter)
import UI.Navigation.Router.Types (Route(..))
import UI.Style (popOverMenuEntryStyle, toolbarBackground, toolbarBorderCol, toolbarButtonStyle, toolbarRippleCol)
import Yoga.Block as Block
import Yoga.Block.Container.Style (col)

mkView ∷ UI.Component Unit
mkView = do
  githubAvatar ← mkGithubAvatar
  view ← mkPresentationalView # liftEffect
  UI.component "HeaderBar" \_ _ → React.do
    { route } ← useRouter
    pure $ view { route, topRight: Just (githubAvatar unit) }

mkPresentationalView ∷
  React.Component { route ∷ Route, topRight ∷ Maybe JSX }
mkPresentationalView = do
  React.component "HeaderBarPresentational" \{ route, topRight } →
    React.do
      pure $ Block.cluster
        { space: "8px"
        , align: "center"
        , justify: "space-between"
        , css:
            toolbarBackground <> borderBottom 1
              <> toolbarBorderCol
              <> fontSemiMedium
              <> textCol' col.textPaler1
              <> textSm
              <> pY 12
              <> pX 24
        }
        [ renderRoute route
        , fold topRight
        ]

renderRoute ∷ Route → JSX
renderRoute route = intercalate separator case route of
  Home → [ R.text "Home" ]
  Solutions → [ R.text "Solutions" ]
  Registry → [ R.text "Registry" ]
  where
  separator = P.div_ (widthAndHeight 14 <> textCol' col.textPaler3)
    [ Heroicon.chevronRight
    ]

mkGithubAvatar ∷ UI.Component Unit
mkGithubAvatar = do
  githubLogin ← mkGithubLogin
  githubAvatarView ← mkGithubAvatarPresentational # liftEffect
  UI.component "GithubAvatar" \ctx _ → React.do
    tokenʔ /\ setToken ← useGithubToken
    (result ∷ _ _ { viewer ∷ { name ∷ String } }) /\ load ← useGithubGraphQL ctx
      (GraphQL "query () { viewer { name } }")
    useEffect tokenʔ $ do
      when (tokenʔ # isJust) do
        load {}
      mempty
    pure
      ( result # RD.toMaybe # maybe
          (githubLogin { tokenʔ, setToken })
          (_.viewer.name >>> githubAvatarView)
      )

mkGithubAvatarPresentational ∷ React.Component String
mkGithubAvatarPresentational = do
  React.component "GithubAvatarPresentational" \name → React.do
    popOverContainerRef ← React.useRef null
    { hidePopOver
    , renderInPopOver
    , targetRef
    , showPopOver
    , isVisible
    } ← usePopOver
      { dismissBehaviourʔ: Just
          (DismissPopOverOnClickOutsideTargetAnd [ popOverContainerRef ])
      , containerId: popOverId
      , placement: Placement Place.Below Place.End
      }
    let
      dotsMenuHoverStyle =
        background' col.backgroundBright3
          <> textCol' col.textPaler1
      dotsMenuActiveStyle =
        dotsMenuHoverStyle
    let
      menuEntry text icon = P.div_
        popOverMenuEntryStyle
        [ P.div_ (widthAndHeight 16) [ icon ]
        , P.div_ (E.css { whiteSpace: E.str "nowrap" }) [ R.text text ]

        ]
    pure $ Block.cluster
      { css: borderBottom 1
          <> borderCol' col.backgroundBright3
      , align: "flex-end"
      , space: "var(--s-1)"
      }
      [ Block.button
          { css:
              toolbarButtonStyle
                <> (active (transform "scale(0.99)"))
                <> guard isVisible dotsMenuActiveStyle
                <> dotsMenuActiveStyle
          , ripple: toolbarRippleCol
          , ref: targetRef
          , onClick: handler_
              (if isVisible then hidePopOver else showPopOver)
          }
          [ Block.cluster { space: "12px" }
              -- [ P.div_ (textXs) [ R.text n ]
              [ Block.cluster { space: "4px" }
                  [ P.div_
                      ( widthAndHeight 32 <> roundedFull <> overflowHidden
                          <> border 2
                          <> borderCol' col.backgroundBright3
                      )
                      [ R.img
                          { width: "32"
                          , height: "32"
                          , src: "https://github.com/" <> name <> ".png"
                          }
                      ]
                  , P.div_ (widthAndHeight 12) [ Heroicon.chevronDown ]
                  ]
              ]
          ]

      , renderInPopOver
          ( R.div'
              </*
                { ref: popOverContainerRef
                , css: mT 1 <> roundedDefault <> border 1
                    <> borderCol' col.backgroundLayer5
                    <> background' col.backgroundLayer3
                }
              />
                [ Block.stack
                    { space: E.str "0"
                    , css:
                        divideY 1 <> divideCol'
                          col.backgroundBright4
                    }
                    [ menuEntry "Rename" Heroicon.pencil
                    , menuEntry "Browse repository" Heroicon.code
                    ]
                ]
          )
      ]