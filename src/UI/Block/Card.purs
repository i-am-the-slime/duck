module UI.Block.Card (card, clickableCard) where

import Yoga.Prelude.View

import Effect.Aff.Compat (runEffectFn1)
import Effect.Unsafe (unsafePerformEffect)
import React.Basic.DOM as R
import React.Basic.Hooks as React
import Record (disjointUnion)
import Record.Extra (pick)
import UI.Block.Card.Style (cardContainerStyle, clickableCardContainerStyle)
import Yoga.Block.Container.Style (colour)
import Yoga.Block.Hook.UseDrip (useDrip)
import Yoga.Block.Quark.Drip.View as Drip

rawCard ∷
  { children ∷ Array JSX
  , onClickʔ ∷ Maybe EventHandler
  } →
  JSX
rawCard = unsafePerformEffect $ React.component "Card" \{ children, onClickʔ } →
  React.do
    ref ← useRef null
    dripProps ← useDrip ref
    let
      drip = Drip.component </>
        ( pick $
            { className: "card-drip"
            , colour: colour.backgroundBright4
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
            if onClickʔ # isJust then clickableCardContainerStyle
            else cardContainerStyle
        , ref
        , onClick
        }
      />
        [ drip
        , R.div'
            </
              { style:
                  R.css
                    { transform: "translateZ(1px)"
                    , backfaceVisibility: "hidden"
                    }
              }
            />
              children
        ]

card ∷ Array JSX → JSX
card children = rawCard { children, onClickʔ: Nothing }

clickableCard ∷ EventHandler → Array JSX → JSX
clickableCard handler children =
  rawCard { children, onClickʔ: Just handler }