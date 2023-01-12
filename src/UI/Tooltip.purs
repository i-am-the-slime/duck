module UI.Tooltip where

import Prelude

import Fahrtwind (background', borderCol', pB, pX, roundedDefault, textCol', textXs)
import React.Basic (JSX)
import React.Basic.DOM as R
import React.Basic.Emotion as E
import UI.Container (tooltipId)
import Yoga.Block.Atom.PopOver.Types (Placement(..), PrimaryPlacement(..), SecondaryPlacement(..))
import Yoga.Block.Atom.Tooltip.View (tooltip)
import Yoga.Block.Container.Style (col)
import Yoga.Prelude.Style as H
import Yoga.Prelude.View as H

withTooltip ∷ Array JSX → JSX → JSX
withTooltip content = tooltip
  { containerId: tooltipId
  , placement: Placement Below Centre
  , fallbackPlacements: [Placement Above Centre]
  , tooltip: H.div_
      ( background' col.backgroundInverted
          <> textCol' col.textInverted
          <> pX 6
          <> pB 2
          <> borderCol' col.popperOuterBorder
          <> roundedDefault
      )
      content
  }

withTextTooltip ∷ String → JSX → JSX
withTextTooltip text = withTooltip
  [ H.span_ (textXs <> E.css { whiteSpace: E.nowrap }) [ R.text text ] ]
