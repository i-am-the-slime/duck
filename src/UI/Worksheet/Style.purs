module UI.Worksheet.Style where

import Yoga.Prelude.Style

import Yoga.Block.Container.Style (col, colour, colourWithAlpha)

shortcutStyle ∷ Style
shortcutStyle = flexRow <> itemsCenter <> gap 4
  <> roundedDefault
  <> pX 6
  <> mB 2
  <> gap 6
  <> alignSelfEnd
  <> border 1
  <> borderBottom 2
  <> borderCol' col.backgroundLayer2
  <> css { borderBottomColor: col.backgroundLayer1 }
  <> background' col.backgroundBright3
  <> textSm
  <> textCol' col.textPaler3
  <> fontNormal

plusStyle ∷ Style
plusStyle =
  fontNormal <> textCol' col.textPaler4
    <> textSm

keyStyle ∷ Style
keyStyle = border 0
  <> borderCol' col.textPaler2
  <> textCol' col.text
  <> textXs
  <> height' (str "fit-content")
  <> pX 0
  <> pY 2

runButtonStyle ∷ Style
runButtonStyle =
  widthFull <> active (transform "scale(0.992)")

-- <> css
--   { """&[data-button-shape="flat"]""": nested
--       $ background'
--           col.highlightAlpha50
--       <> hover (background' col.highlightAlpha67)
--   }
-- <> borderCol' col.backgroundLayer3
-- <> css { borderWidth: str "calc(1px * var(--dark-mode))" }
-- <> shadowDefault

buttonContentStyle ∷ Style
buttonContentStyle =
  displayGrid <> textLg <> gap 8 <> fontNormal
    <> css { gridTemplateColumns: str "46px 1fr 46px" }
    <> widthFull
