module UI.Navigation.ThemeSwitcher where

import Yoga.Prelude.View hiding ((/))

import Data.Newtype (class Newtype)
import Effect.Unsafe (unsafePerformEffect)
import React.Basic.Emotion (Style)
import React.Basic.Hooks as React
import Routing.Duplex (RouteDuplex')
import Routing.Duplex as R
import Routing.Duplex.Generic as RG
import Routing.Duplex.Generic.Syntax ((/))
import UI.Navigation.Router.Page.Github as Github
import UI.Navigation.Router.Page.Preferences as Preferences
import UI.Navigation.Router.Types (Route)
import Yoga.Block as Block
import Yoga.Block.Container.Style (DarkOrLightMode(..), getDarkOrLightMode)

type ThemeSwitcher =
  { theme ∷ DarkOrLightMode
  , setTheme ∷ DarkOrLightMode → Effect Unit
  }

newtype UseTheme ∷ Type → Type
newtype UseTheme hooks = UseTheme (UseContext ThemeSwitcher hooks)

derive instance Newtype (UseTheme hooks) _

useTheme ∷ Hook UseTheme ThemeSwitcher
useTheme =
  React.coerceHook do
    React.useContext themeContext

themeContext ∷ React.ReactContext ThemeSwitcher
themeContext = unsafePerformEffect do
  themeʔ ← getDarkOrLightMode
  React.createContext { theme: themeʔ # fromMaybe LightMode, setTheme: mempty }

mkThemeProvider ∷ Style → React.Component JSX
mkThemeProvider globalStyles = do
  React.component "ThemeProvider" \child → React.do
    theme /\ setTheme ← React.useState' LightMode
    pure
      $ React.provider themeContext
          { theme
          , setTheme
          }
          [ Block.container
              </
                { onPreferredSystemThemeChange: setTheme
                , themeVariant: Just theme
                , globalStyles
                }
              /> [ child ]
          ]

appRoute ∷ RouteDuplex' Route
appRoute =
  R.root
    $ RG.sum
        { "Home": RG.noArgs
        , "Solutions": "projects" / RG.noArgs
        , "Registry": "registry" / RG.noArgs
        , "Github": "github" / Github.subRoute
        , "Preferences": "preferences" / Preferences.subRoute
        }
