module UI.Block.Card.Style where

import Yoga.Prelude.Style

import Fahrtwind (active, background', border, borderCol', cursorPointer, overflowHidden, pB, pT, pX, pY, positionRelative, rounded2xl, roundedXl, shadowLg, shadowMd, textCol', transform, transition, userSelectNone)
import Yoga.Block.Container.Style (col)

cardContainerStyle ∷ Style
cardContainerStyle =
  ( rounded2xl
      <> background' col.backgroundBright3
      <> textCol' col.textPaler1
      <> pX 24
      <> pT 16
      <> pB 24
      <> shadowLg
      <> overflowHidden
      <> positionRelative
      <> userSelectNone
  )

clickableCardContainerStyle ∷ Style
clickableCardContainerStyle =
  cardContainerStyle
    <> transition "all 0.2s ease-out"
    <> active (transform "scale(0.997)")
    <> cursorPointer
