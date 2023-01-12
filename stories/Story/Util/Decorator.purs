module Story.Util.Decorator where

import Prelude

import Story.Util.NotificationCentre (storyNotificationCentre)
import UI.Container (mkContainer, ourGlobalStyle)
import UI.Navigation.ThemeSwitcher (mkThemeProvider)

containerDecorator = \x → ado
  themeProvider ← mkThemeProvider ourGlobalStyle
  container ← mkContainer storyNotificationCentre
  in themeProvider $ container [ x ]
