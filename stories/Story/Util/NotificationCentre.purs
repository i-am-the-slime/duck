module Story.Util.NotificationCentre where

import Effect.Unsafe (unsafePerformEffect)
import Yoga.Block.Organism.NotificationCentre (mkNotificationCentre)
import Yoga.Block.Organism.NotificationCentre.Types (NotificationCentre)

storyNotificationCentre ∷ NotificationCentre
storyNotificationCentre = unsafePerformEffect mkNotificationCentre
