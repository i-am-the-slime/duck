module UI.Project where

import Prelude

import Biz.Github.Types as Github
import Biz.Spago.Types as Spago
import Data.Maybe (Maybe(..))
import Fahrtwind (background', borderBottom, borderCol', divideY, hover, mL, mT, pXY, pY', roundedDefault, roundedLg, textCol', textXl, transition, widthAndHeight)
import Fahrtwind as F
import Fahrtwind.Icon.Heroicons as Heroicons
import React.Basic (JSX)
import React.Basic.DOM (text)
import React.Basic.DOM as R
import React.Basic.Emotion (var)
import React.Basic.Emotion as E
import React.Basic.Events (handler_)
import React.Basic.Hooks as React
import Spago.SpagoDhall.Types (SpagoDhall)
import UI.Component as UI
import UI.Container (popOverId)
import UI.Style (popOverMenuEntryStyle)
import Yoga.Block as Block
import Yoga.Block.Atom.PopOver.Types (HookDismissBehaviour(..), Placement(..))
import Yoga.Block.Atom.PopOver.Types as Place
import Yoga.Block.Container.Style (col)
import Yoga.Block.Hook.UsePopOver (usePopOver)
import Yoga.Prelude.Style (Style, StyleProperty, css, nested)
import Yoga.Prelude.Style as H
import Yoga.Prelude.View (foldMap, guard, null, pure, (#), ($), (/>), (</), (</*), (<>))
import Yoga.Prelude.View as H

mkView ∷ UI.Component SpagoDhall
mkView = do
  projectName ← mkProjectName
  UI.component "Project" \_ props → React.do
    let
      { name
      , repository
      , dependencies
      , sources
      , packages
      } = props
    pure $
      Block.box_
        [ Block.stack { space: var "--s2" }
            [ Block.stack_
                [ projectName (name ∷ Spago.ProjectName)
                , repository # foldMap \(Github.Repository repo) → R.h3_
                    [ R.text repo ]
                ]
            , Block.stack { space: E.var "--s0" }
                [ R.label' </* { css: textXl, htmlFor: "dependencies" } />
                    [ R.text "Dependencies" ]
                , R.span' </ { id: "dependencies" } />
                    [ R.ul_
                        ( dependencies <#> renderDependency
                        )
                    ]
                ]
            ]
        ]

renderDependency ∷ Spago.ProjectName → JSX
renderDependency (Spago.ProjectName depName) = R.li_ $ pure $
  text depName

-- Just { repo: Repository repo, version: Version version } →
--   Block.cluster
--     { wrapper: R.div' </* { css: mXY 0 <> pXY 0 }
--     }
--     [ R.a' </* { css: hover underline, href: repo } />
--         [ R.text depName ]
--     , R.code' </* { css: textSm <> textCol' col.textPaler3 } />
--         [ R.text version ]
--     ]

mkProjectName ∷ UI.Component Spago.ProjectName
mkProjectName =
  UI.component "ProjectName" \_ctx (Spago.ProjectName name) → React.do
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
      , fallbackPlacements: [ Placement Place.Above Place.End ]
      }
    let
      dotsMenuHoverStyle =
        background' col.backgroundBright4
          <> textCol' col.textPaler1
      dotsMenuActiveStyle =
        dotsMenuHoverStyle
    let
      menuEntry text icon = H.div_
        popOverMenuEntryStyle
        [ H.div_ (widthAndHeight 16) [ icon ]
        , R.text text
        ]
    pure $ Block.cluster
      { css: pY' (var "--s1") <> borderBottom 1
          <> borderCol' col.backgroundBright3
      , align: "flex-end"
      , space: "var(--s-1)"
      }
      [ R.h2'
          </*
            { css: F.text4xl <> F.fontBold
                <> textCol' col.textPaler1
            }
          />
            [ R.text name ]
      , R.div'
          </*
            { css:
                ( widthAndHeight 38 <> pXY 6 <> roundedLg
                    <> mL 4
                    <> textCol' col.textPaler2
                    <> borderCol' col.background
                    <> transition "background 350ms ease"
                    <> hover dotsMenuHoverStyle
                    <> guard isVisible dotsMenuActiveStyle
                )
            , ref: targetRef
            , onClick: handler_
                (if isVisible then hidePopOver else showPopOver)
            }
          />
            [ Heroicons.dotsVertical
            ]
      , renderInPopOver
          ( R.div'
              </*
                { ref: popOverContainerRef
                , css: mT 1 <> roundedDefault <> F.border 1
                    <> borderCol' col.backgroundLayer2
                    <> background' col.backgroundBright1
                }
              />
                [ Block.stack
                    { space: E.str "0"
                    , css:
                        divideY 1 <> divideCol'
                          col.backgroundBright3

                    }
                    [ menuEntry "Rename" Heroicons.pencil
                    , menuEntry "Browse repository" Heroicons.code
                    ]
                ]
          )
      ]

nestChildren ∷ Style → Style
nestChildren inner = css { "& > * + *": nested inner }

divideCol' ∷ StyleProperty → Style
divideCol' sp =
  nestChildren
    $ css
        { borderColor: sp }
