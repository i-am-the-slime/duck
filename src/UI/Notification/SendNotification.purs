module UI.Notification.SendNotification where

import Prelude

import Effect (Effect)
import Yoga.Block.Organism.NotificationCentre.Types (NotificationCentre(..), Notification)

sendNotification ∷
  ∀ ctx.
  { notificationCentre ∷ NotificationCentre | ctx } →
  Notification →
  Effect Unit
sendNotification ctx n = do
  let (NotificationCentre nc) = ctx.notificationCentre
  nc.enqueueNotification n