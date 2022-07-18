module UI.Style where

import Yoga.Prelude.Style
import Fahrtwind (background, background', borderCol', flexRow, gap, hover, itemsCenter, mXY, pX, pY, roundedDefault, textCol', textSm, transition, userSelectNone)
import Yoga.Block.Container.Style (col, colour)

toolbarBackground ∷ Style
toolbarBackground = background' col.backgroundBright3

toolbarBorderCol ∷ Style
toolbarBorderCol = borderCol' col.backgroundBright4

toolbarRippleCol ∷ String
toolbarRippleCol = colour.backgroundLayer3

toolbarTextCol ∷ Style
toolbarTextCol = textCol' col.textPaler4

toolbarButtonStyle ∷ Style
toolbarButtonStyle =
  background transparent
    <> transition "background,color 0.35s ease-out"
    <> toolbarTextCol
    <> css
      { boxShadow: none
      , """&[aria-pressed="true"], &[aria-pressed="true"]:hover""":
          nested
            $ textCol' col.text
      , "&:active": nested $ css
          { boxShadow: none
          , transform: str "scale(0.99)"
          }
      , "&:hover": nested
          $ textCol' col.textPaler1
      , "& > svg > path": nested $ css
          { strokeWidth: str "1.2px" }
      }

popOverMenuEntryStyle ∷ Style
popOverMenuEntryStyle =
  flexRow <> itemsCenter <> gap 16 <> pX 8 <> pY 6 <> mXY 4
    <> textSm
    <> transition "background 240ms ease-out"
    <> userSelectNone
    <> roundedDefault

popOverMenuEntryHoverStyle ∷ Style
popOverMenuEntryHoverStyle =
  hover (background' col.backgroundBright6)