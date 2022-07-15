module UI.Block.Card.Style where

import Yoga.Prelude.Style

import Fahrtwind (active, background', border, borderCol', cursorPointer, heightFull, overflowHidden, pB, pT, pX, pY, positionRelative, rounded2xl, roundedXl, shadowLg, shadowMd, textCol', transform, transition, userSelectNone, widthFull)
import Yoga.Block.Container.Style (col)

cardContainerStyle ∷ Style
cardContainerStyle =
  ( rounded2xl
      <> background' col.backgroundBright3
      <> textCol' col.textPaler1
      <> pX 24
      <> pT 16
      <> pB 24
      <> shadowMd
      <> overflowHidden
      <> positionRelative
      <> userSelectNone
      <> widthFull
      <> heightFull
  )

cardContentStyle ∷ Style
cardContentStyle =
  transform "translateZ(1px)"
    <> css { backfaceVisibility: str "hidden" }
    <> widthFull
    <> heightFull

clickableCardContainerStyle ∷ Style
clickableCardContainerStyle =
  cardContainerStyle
    <> transition "all 0.2s ease-out"
    <> active (transform "scale(0.997)")
    <> cursorPointer
