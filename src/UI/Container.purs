module UI.Container where

import Yoga.Prelude.View

import Fahrtwind (background', globalStyles, heightFull, heightScreen, ignoreClicks, overflowHidden, overflowVisible, positionAbsolute, positionFixed, widthFull, widthScreen)
import Fahrtwind as F
import Plumage.Prelude.Style (Style)
import Plumage.Util.HTML as H
import React.Basic.DOM as R
import React.Basic.Emotion as E
import React.Basic.Emotion as Emotion
import Yoga.Block.Container.Style (col, global)
import Yoga.Block.Organism.NotificationCentre.Notification.View (mkNotificationCentreView, renderAnimatedNotifications)
import Yoga.Block.Organism.NotificationCentre.Types (NotificationCentre)

popOverId ∷ String
popOverId = "popOver"

tooltipId ∷ String
tooltipId = "tooltip"

notificationsId ∷ String
notificationsId = "notifications"

mkContainer ∷ NotificationCentre → Effect (Array JSX → JSX)
mkContainer notificationCentre = do
  notificationCentreView ← mkNotificationCentreView notificationCentre
    { containerId: notificationsId
    , renderNotifications: renderAnimatedNotifications
    }
  pure \children → fragment
    [ Emotion.global </>
        { styles: globalStyles <> global <> ourGobalStyle }
    , H.div "container" mempty children
    , notificationCentreView
    , scrollableFullScreenLayerDiv popOverId 10
    , scrollableFullScreenLayerDiv tooltipId 20
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

ourGobalStyle ∷ Style
ourGobalStyle = E.css
  { body: E.nested $ (background' col.backgroundLayer1) <> E.css
      { "--mono-font": E.str "'Jetbrains Mono', monospace"
      }
  , a: E.nested $ E.css
      { textDecoration: E.none
      , fontWeight: E.str "normal"
      }
  }