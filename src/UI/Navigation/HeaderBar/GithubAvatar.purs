module UI.Navigation.HeaderBar.GithubAvatar where

import Yoga.Prelude.View

import Biz.GraphQL (GraphQL(..))
import Data.Maybe (isNothing)
import Data.Time.Duration (Days(..), convertDuration)
import Fahrtwind (active, background', border, borderBottom, borderCol', divideY, fontMedium, hover, mT, overflowHidden, roundedDefault, roundedFull, roundedLg, shadowXxl, textXs, transform, widthAndHeight)
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
import UI.GithubLogin.UseIsLoggedIntoGithub (useIsLoggedIntoGithub)
import UI.Style (popOverMenuEntryHoverStyle, popOverMenuEntryStyle, toolbarButtonStyle, toolbarRippleCol)
import Yoga.Block as Block
import Yoga.Block.Container.Style (col)

mkView ∷ UI.Component Unit
mkView = do
  githubLogin ← mkGithubLogin
  githubAvatarView ← mkGithubAvatarPresentational # liftEffect
  UI.component "GithubAvatar" \ctx _ → React.do
    { isLoggedIn, checkIsLoggedIn } ← useIsLoggedIntoGithub ctx
    useEffectAlways $ mempty <$ do
      unless isLoggedIn do checkIsLoggedIn

    { data: userInfoRD, send: loadUserInfo } ←
      useGithubGraphQL @UserInfoQueryVariables @UserInfoQueryResult
        ctx (Just (convertDuration (30.0 # Days)))
          (GraphQL "query { viewer { login } }")

    useEffect isLoggedIn $ mempty <$ do
      when (userInfoRD # RD.toMaybe # isNothing) do loadUserInfo ({} :: Record UserInfoQueryVariables)

    pure
      if isLoggedIn then
        userInfoRD # RD.toMaybe # foldMap (githubAvatarView <<< _.data.viewer.login)
      else
        githubLogin { onComplete: checkIsLoggedIn }

type UserInfoQueryVariables = ()

type UserInfoQueryResult =
  (data ∷ { viewer ∷ { login ∷ String } })

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
      menuEntry text icon onClickʔ = R.div'
        </*
          { css: popOverMenuEntryStyle
              <> guard (onClickʔ # isJust) popOverMenuEntryHoverStyle
                    <> textXs
          , onClick: handler_ (onClickʔ # fold)
          }
        />
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
                <> guard isVisible (background' col.backgroundLayer3)
                <> hover (background' col.backgroundLayer3)
          , ripple: toolbarRippleCol
          , ref: targetRef
          , onClick: handler_
              (if isVisible then hidePopOver else showPopOver)
          }
          [ Block.cluster { space: "12px" }
              [ Block.cluster { space: "4px" }
                  [ P.div_
                      ( widthAndHeight 32 <> roundedFull <> overflowHidden
                      )
                      [ Block.image
                          { width: 32
                          , height: 32
                          , src: "https://github.com/" <> name <> ".png"
                          , fallbackSrc: duckImage
                          }
                      ]
                  , P.div_ (widthAndHeight 14) [ Heroicon.chevronDown ]
                  ]
              ]
          ]
      , renderInPopOver
          ( R.div'
              </*
                { ref: popOverContainerRef
                , css: mT 1 <> roundedDefault <> border 1
                    <> borderCol' col.backgroundBright5
                    <> background' col.backgroundLayer4
                    <> roundedLg
                    <> shadowXxl
                    <> fontMedium
                }
              />
                [ Block.stack
                    { space: E.str "0"
                    , css:
                        divideY 1 <> divideCol'
                          col.backgroundLayer2
                    }
                    [ menuEntry ("Logged in as " <> name) Heroicon.user Nothing
                    -- , menuEntry "Browse repository" Heroicon.code Nothing
                    ]
                ]
          )
      ]

foreign import duckImage :: String
foreign import notFoundImage :: String
