module UI.Container where

import Yoga.Prelude.View

import Fahrtwind (background, background', height, heightFull, heightScreen, hover, ignoreClicks, overflowHidden, overflowVisible, positionAbsolute, positionFixed, width, widthFull, widthScreen)
import Fahrtwind as F
import Plumage.Prelude.Style (Style)
import React.Basic.DOM as R
import React.Basic.Emotion as E
import Yoga.Block.Container.Style (col)
import Yoga.Block.Organism.NotificationCentre.Notification.View (mkNotificationCentreView, renderAnimatedNotifications)
import Yoga.Block.Organism.NotificationCentre.Types (NotificationCentre)

popOverId ∷ String
popOverId = "popOver"

tooltipId ∷ String
tooltipId = "tooltip"

modalContainerId ∷ String
modalContainerId = "modal"

modalClickawayId ∷ String
modalClickawayId = "modal-clickaway"

notificationsId ∷ String
notificationsId = "notifications"

mkContainer ∷
  NotificationCentre →
  Effect (Array JSX → JSX)
mkContainer notificationCentre = do
  notificationCentreView ← mkNotificationCentreView notificationCentre
    { containerId: notificationsId
    , renderNotifications: renderAnimatedNotifications
    }
  pure \children → fragment
    $ children
    <>
      [ notificationCentreView
      , scrollableFullScreenLayerDiv popOverId 10
      , scrollableFullScreenLayerDiv tooltipId 20
      , fixedFullScreenLayerDiv modalClickawayId 30
      , fixedFullScreenLayerDiv modalContainerId 40
      , fixedFullScreenLayerDiv notificationsId 300
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
            <> overflowHidden
        }
      />
        []
  fixedFullScreenLayerDiv id zIndex =
    R.div' </* { id, css: fullScreenLayerStyle zIndex } /> []
  fullScreenLayerStyle zIndex =
    positionFixed <> F.left 0 <> F.top 0 <> widthScreen <> heightScreen
      <> overflowHidden
      <> ignoreClicks
      <> F.zIndex zIndex

ourGlobalStyle ∷ Style
ourGlobalStyle = E.css
  { html: E.nested $ E.css
      { width: E.vw 100.0
      , overflowX: E.hidden
      , height: E.vh 100.0
      , overflowY: E.hidden
      }
  , body: E.nested $ (background' col.backgroundLayer1)
      <> E.css
        { "--mono-font": E.str "'Jetbrains Mono', monospace"
        , scrollbarGutter: E.str "stable"
        }
  , "*": E.nested $ E.css
      { "&::-webkit-scrollbar":
          E.nested $ width 12 <> height 6
      , "&::-webkit-scrollbar-track": E.nested
          $ background' col.backgroundBright3
      , "&::-webkit-scrollbar-thumb": E.nested
          $ E.css
              { background: col.backgroundBright5
              -- , borderRadius: E.str "4px"
              -- , border: E.str
              --     ( "1px solid " <> colour.backgroundLayer1
              --     )
              }

          <> hover
            (background' col.textPaler4)

      , "&::-webkit-scrollbar-corner": E.nested
          $ background' col.backgroundLayer2
      , a: E.nested $ E.css
          { textDecoration: E.none
          , fontWeight: E.str "normal"
          }
      }
  }
