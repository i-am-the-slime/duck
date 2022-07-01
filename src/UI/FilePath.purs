module UI.FilePath where

import Yoga.Prelude.View
import React.Basic.DOM as R
import Fahrtwind (background', border, borderCol', pX, pY, roundedDefault, textSm)
import Yoga.Block.Container.Style (col)

renderFilePath ∷ String → JSX
renderFilePath p = R.code'
  </*
    { css: border 1 <> roundedDefault
        <> borderCol' col.backgroundBright5
        <> textSm
        <> pX 4
        <> pY 2
        <> background' col.backgroundLayer3
    }
  /> [ R.text p ]