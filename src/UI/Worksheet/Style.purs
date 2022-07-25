module UI.Worksheet.Style where

import Yoga.Prelude.Style
import Yoga.Block.Container.Style (col, colour, colourWithAlpha)

shortcutStyle ∷ Style
shortcutStyle = flexRow <> itemsCenter <> gap 4
  <> roundedDefault
  <> pX 8
  <> mB 2
  <> alignSelfEnd
  <> border 1
  <> borderBottom 2
  <> borderCol' col.backgroundLayer2
  <> css { borderBottomColor: col.backgroundLayer1 }
  <> background' col.backgroundBright3

plusStyle ∷ Style
plusStyle =
  fontNormal <> textCol' col.textPaler4
    <> textSm

keyStyle ∷ Style
keyStyle = border 0
  <> borderCol' col.textPaler2
  <> textCol' col.textPaler2
  <> textXs
  <> height' (str "fit-content")
  <> pX 0
  <> pY 2

runButtonStyle ∷ Style
runButtonStyle =
  widthFull
    <> background' (str $ colourWithAlpha.backgroundLayer5 0.5)
    <> active (transform "scale(0.992)")
    <> css { borderWidth: str "calc(1px * var(--dark-mode))" }
    <> borderCol' col.backgroundLayer5
    <> shadowDefault

buttonContentStyle ∷ Style
buttonContentStyle =
  displayGrid <> textLg <> gap 8 <> fontNormal
    <> css { gridTemplateColumns: str "50px 1fr 50px" }
    <> widthFull
