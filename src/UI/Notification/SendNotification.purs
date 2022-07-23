module UI.Notification.SendNotification where

import Prelude

import Effect (Effect)
import React.Basic.DOM as R
import UI.Notification.ErrorNotification (errorNotification)
import Yoga.Block.Organism.NotificationCentre.Types (NotificationCentre(..), Notification)

sendNotification ∷
  ∀ ctx.
  { notificationCentre ∷ NotificationCentre | ctx } →
  Notification →
  Effect Unit
sendNotification ctx n = do
  let (NotificationCentre nc) = ctx.notificationCentre
  nc.enqueueNotification n

notifyError ∷
  ∀ r. { notificationCentre ∷ NotificationCentre | r } → String → Effect Unit
notifyError ctx message = sendNotification ctx $
  errorNotification { title: "Error", body: R.text message }
