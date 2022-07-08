module UI.Modal where

import Yoga.Prelude.View

import Data.Maybe (isNothing)
import Debug (spy)
import Fahrtwind.Style (pT, pY)
import Framer.Motion as M
import Plumage.Atom.Modal.View (mkModal)
import React.Aria.Overlays (usePreventScroll)
import React.Basic.DOM as R
import React.Basic.Hooks as React
import Unsafe.Reference (reallyUnsafeRefEq)

mkModalView ∷
  { clickAwayId ∷ String, modalContainerId ∷ String } →
  React.Component
    { childʔ ∷ Maybe JSX, hide ∷ Effect Unit, onHidden ∷ Effect Unit }
mkModalView { clickAwayId, modalContainerId } = do
  modal ← mkModal # liftEffect
  React.component "ModalView" \props → React.do
    usePreventScroll { isDisabled: props.childʔ # isNothing }
    let
      exit =
        M.exit $ R.css
          { y: "-120%"
          , transition:
              { type: "spring", bounce: 0.2, duration: 0.8 }
          }
    pure $ modal
      { isVisible: props.childʔ # isJust
      , clickAwayId
      , modalContainerId
      , hide: props.hide
      , allowClickAway: true
      , content:
          M.animatePresence </ {} />
            [ props.childʔ # foldMap \child →
                M.div
                  </*
                    { key: "modal"
                    , css: (pY 16 <> pT 116)
                    , initial: M.initial $ R.css
                        { y: "-100%"
                        }
                    , animate: M.animate $ R.css
                        { y: "calc(0% - 100px)"
                        , transition:
                            { type: "spring", bounce: 0.33, duration: 0.5 }

                        }
                    , exit

                    , onClick: handler stopPropagation mempty
                    , onAnimationComplete: M.onAnimationComplete \fgn → do
                        if (reallyUnsafeRefEq fgn exit) then props.onHidden
                        else mempty

                    }
                  />
                    [ child ]
            ]
      }
