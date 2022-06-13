module UI.Container where

import Yoga.Prelude.View

import Fahrtwind (background, background', fontFamilyOrMono, heightFull, heightScreen, ignoreClicks, overflowHidden, overflowVisible, positionAbsolute, positionFixed, widthFull, widthScreen)
import Fahrtwind (globalStyles)
import Fahrtwind as F
import Fahrtwind as P
import Plumage.Prelude.Style (Style)
import Plumage.Util.HTML as H
import React.Basic.DOM as R
import React.Basic.Emotion as E
import React.Basic.Emotion as Emotion
import Yoga.Block.Container.Style (col, global)

popOverId :: String
popOverId = "popOver"

container :: Array JSX -> JSX
container children = fragment
  [ Emotion.global </>
      { styles: globalStyles <> global
          <> ourGobalStyle

      }
  , H.div "container" (background' col.backgroundBright1) children
  , scrollableFullScreenLayerDiv popOverId 100

  ]
  where
  scrollableFullScreenLayerDiv id zIndex =
    R.div'
      </*
        { id
        , css: fullScreenLayerStyle zIndex
            <> positionAbsolute
            <> overflowVisible
            <> heightFull
            <> widthFull
        }
      />
        []
  fixedFullScreenLayerDiv id zIndex =
    R.div' </* { id, css: fullScreenLayerStyle zIndex } /> []
  fullScreenLayerStyle zIndex =
    positionFixed <> F.left 0 <> F.top 0 <> widthScreen <> heightScreen
      <> overflowHidden
      <> ignoreClicks
      <> P.zIndex zIndex

ourGobalStyle :: Style
ourGobalStyle = E.css
  { body: E.nested $ (background' col.backgroundLayer1) <> E.css
      { "--mono-font": E.str "'Jetbrains Mono', monospace"
      }
  }