module Story.Util.Decorator where

import Prelude

import Story.Util.NotificationCentre (storyNotificationCentre)
import Storybook as Storybook
import Storybook.Types (Decorator)
import UI.Container (mkContainer)
import UI.MainPane.View as MainPaine

containerDecorator ∷ Decorator
containerDecorator = Storybook.decorator \x → ado
  container ← mkContainer storyNotificationCentre
  in container [ x ]
