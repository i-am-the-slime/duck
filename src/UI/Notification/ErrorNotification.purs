module UI.Notification.ErrorNotification where

import Yoga.Prelude.View

import Fahrtwind (mB, textCol', widthAndHeight)
import Fahrtwind.Icon.Heroicons as Heroicon
import React.Basic.DOM as R
import Yoga.Block as Block
import Yoga.Block.Container.Style (col)
import Yoga.Block.Organism.NotificationCentre.Notification.Style (defaultNotificationBodyStyle, defaultNotificationContentContainerStyle, defaultNotificationContentStyle, defaultNotificationTitleStyle)
import Yoga.Block.Organism.NotificationCentre.Notification.View (notificationDismissButton)
import Yoga.Block.Organism.NotificationCentre.Types (Notification)

errorNotification ∷ { body ∷ JSX, title ∷ String } → Notification
errorNotification { title, body } =
  { render: \{ dismiss } →
      R.div'
        </*
          { css: defaultNotificationContentContainerStyle
          }
        />
          [ R.div' </* { css: defaultNotificationContentStyle } />
              [ Block.cluster { space: "var(--s-2)", align: "center" }
                  [ R.div'
                      </*
                        { css: widthAndHeight 16 <> mB 4 <> textCol' col.invalid
                        }
                      />
                        [ Heroicon.exclamationCircle ]
                  , R.div' </* { css: defaultNotificationTitleStyle } />
                      [ R.text title ]
                  ]
              , R.div' </* { css: defaultNotificationBodyStyle } />
                  [ body ]
              ]
          , notificationDismissButton dismiss
          ]
  , autoHideAfter: Nothing
  }