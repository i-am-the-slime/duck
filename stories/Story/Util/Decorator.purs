module Story.Util.Decorator where

import Prelude

import Story.Util.NotificationCentre (storyNotificationCentre)
import Storybook as Storybook
import Storybook.Types (Decorator)
import UI.Container (mkContainer, ourGlobalStyle)
import UI.Navigation.ThemeSwitcher (mkThemeProvider)

containerDecorator ∷ Decorator
containerDecorator = Storybook.decorator \x → ado
  themeProvider ← mkThemeProvider ourGlobalStyle
  container ← mkContainer storyNotificationCentre
  in themeProvider $ container [ x ]
