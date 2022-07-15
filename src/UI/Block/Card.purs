module UI.Block.Card (card, clickableCard, styledCard, styledClickableCard) where

import Yoga.Prelude.View

import Effect.Aff.Compat (runEffectFn1)
import Effect.Unsafe (unsafePerformEffect)
import Fahrtwind (heightFull, widthFull)
import React.Basic.DOM as R
import React.Basic.Emotion as E
import React.Basic.Hooks as React
import Record (disjointUnion)
import Record.Extra (pick)
import UI.Block.Card.Style (cardContainerStyle, cardContentStyle, clickableCardContainerStyle)
import Yoga.Block.Container.Style (colour, colourWithAlpha)
import Yoga.Block.Hook.UseDrip (useDrip)
import Yoga.Block.Quark.Drip.View as Drip

rawCard ∷
  { children ∷ Array JSX
  , style ∷ E.Style
  , onClickʔ ∷ Maybe EventHandler
  } →
  JSX
rawCard = unsafePerformEffect $ React.component "Card"
  \{ children, style, onClickʔ } →
    React.do
      ref ← useRef null
      dripProps ← useDrip ref
      let
        drip = Drip.component </>
          ( pick $
              { className: "card-drip"
              , colour: colourWithAlpha.backgroundBright5 0.5
              } `disjointUnion` dripProps
          )
        onClick =
          case onClickʔ of
            Nothing → mempty
            Just givenHandler → handler syntheticEvent \e → do
              void $ runEffectFn1 givenHandler e
              void $ runEffectFn1 dripProps.onClick e
      pure $ R.div'
        </*
          { css:
              ( if onClickʔ # isJust then clickableCardContainerStyle
                else cardContainerStyle
              ) <> style
          , ref
          , onClick
          }
        />
          [ drip
          , R.div'
              </*
                { css:
                    cardContentStyle
                }
              />
                children
          ]

card ∷ Array JSX → JSX
card children = rawCard { style: mempty, children, onClickʔ: Nothing }

clickableCard ∷ EventHandler → Array JSX → JSX
clickableCard onClick children =
  rawCard { style: mempty, children, onClickʔ: Just onClick }

styledCard ∷ E.Style → Array JSX → JSX
styledCard style children = rawCard { style, children, onClickʔ: Nothing }

styledClickableCard ∷ E.Style → EventHandler → Array JSX → JSX
styledClickableCard style onClick children = rawCard
  { style, children, onClickʔ: Just onClick }