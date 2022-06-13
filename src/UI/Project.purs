module UI.Project where

import Prelude

import Biz.Spago.Types as Spago
import Data.Maybe (Maybe(..))
import Fahrtwind (alignSelfCenter, background', border, borderBottom, borderCol, borderCol', divideCol, divideX, divideY, firstOfType, flexRow, fontFamilyOrMono, gap, hover, itemsCenter, linearGradient, mT, mX, mXY, mY, pB, pT, pX, pXY, pY, pY', roundedDefault, roundedFull, roundedLg, shadow, shadowXxl, textCol, textCol', textSm, transition, widthAndHeight)
import Fahrtwind as F
import Fahrtwind.Icon.Heroicons as Heroicons
import Plumage.Atom.PopOver.Types (HookDismissBehaviour(..), Placement(..), PrimaryPlacement(..), SecondaryPlacement(..))
import Plumage.Atom.PopOver.Types as Place
import Plumage.Hooks.UsePopOver (usePopOver)
import Plumage.Prelude.Style (Style, StyleProperty, css, nested)
import Plumage.Util.HTML as H
import Plumage.Util.HTML as P
import React.Basic.DOM as R
import React.Basic.Emotion (var)
import React.Basic.Emotion as E
import React.Basic.Events (handler_)
import React.Basic.Hooks as React
import UI.Component as UI
import UI.Container (popOverId)
import Yoga.Block as Block
import Yoga.Block.Container.Style (col)
import Yoga.Prelude.View (foldMap, guard, null, pure, (#), ($), (/>), (<#>), (</), (</*), (<>))

mkView :: UI.Component Spago.ProjectConfig
mkView = do
  projectName <- mkProjectName
  UI.component "Project" \_ props -> React.do
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
                [ projectName name
                , repository # foldMap \(Spago.Repository repo) -> R.h3_
                    [ R.text repo ]
                ]
            , R.label' </ { htmlFor: "dependencies" } />
                [ R.span' </ { id: "dependencies" } />
                    [ Block.stack'
                        </
                          { space: E.str "0"
                          }
                        />
                          ( dependencies <#> \(Spago.ProjectName depName) ->
                              R.code_ [ R.text depName ]
                          )
                    ]
                ]
            ]
        ]

mkProjectName :: UI.Component Spago.ProjectName
mkProjectName =
  UI.component "ProjectName" \_ctx (Spago.ProjectName name) -> React.do
    popOverContainerRef <- React.useRef null
    { hidePopOver
    , renderInPopOver
    , targetRef
    , showPopOver
    , isVisible
    } <- usePopOver
      { dismissBehaviourʔ: Just
          (DismissPopOverOnClickOutsideTargetAnd [ popOverContainerRef ])
      , containerId: popOverId
      , placement: Placement Place.Below Place.End
      }
    let
      dotsMenuHoverStyle =
        background' col.backgroundBright3
      dotsMenuActiveStyle =
        dotsMenuHoverStyle
    let
      menuEntry text icon = H.div_
        ( flexRow <> itemsCenter <> gap 16 <> pX 8 <> pY 6 <> mXY 4
            <> textSm
            <> transition "background 350ms ease"
            <> hover (background' col.backgroundBright3)
            <>
              roundedDefault
        )
        [ H.div_ (widthAndHeight 16) [ icon ]
        , R.text text
        ]
    pure $ Block.cluster
      { css: pY' (var "--s1") <> borderBottom 1
          <> borderCol' col.backgroundBright3
      , align: "flex-end"
      }
      [ R.h2' </* { css: F.text4xl <> F.fontBold } />
          [ R.text name ]
      , R.div'
          </*
            { css:
                ( widthAndHeight 36 <> pXY 6 <> roundedLg
                    <> border 4
                    <> borderCol' col.background
                    <> transition "background 350ms ease"
                    <> hover dotsMenuHoverStyle
                    <> guard isVisible dotsMenuActiveStyle
                )
            , ref: targetRef
            , onClick: handler_ (if isVisible then hidePopOver else showPopOver)
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
                    <> shadow
                      """0px 1.1px 2.2px rgba(0, 0, 0, 0.02),
  0px 2.7px 5.3px rgba(0, 0, 0, 0.028),
  0px 5px 10px rgba(0, 0, 0, 0.035),
  0px 8.9px 17.9px rgba(0, 0, 0, 0.042),
  0px 16.7px 33.4px rgba(0, 0, 0, 0.05),
  0px 40px 80px rgba(0, 0, 0, 0.07)"""
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

nestChildren :: Style -> Style
nestChildren inner = css { "& > * + *": nested inner }

divideCol' :: StyleProperty -> Style
divideCol' sp =
  nestChildren
    $ css
        { borderColor: sp }