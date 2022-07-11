module UI.Navigation.ThemeSwitcher where

import Yoga.Prelude.View hiding ((/))

import Data.Either (Either, fromRight)
import Data.Maybe (fromMaybe)
import Data.Newtype (class Newtype)
import Data.Tuple.Nested ((/\))
import Effect (Effect)
import Effect.Ref as Ref
import Effect.Unsafe (unsafePerformEffect)
import Fahrtwind.Style.Global (globalStyles) as FW
import React.Basic.DOM (CSS)
import React.Basic.Emotion (Style)
import React.Basic.Hooks (JSX, UseContext, Hook)
import React.Basic.Hooks as React
import Routing.Duplex (RouteDuplex')
import Routing.Duplex as R
import Routing.Duplex.Generic as RG
import Routing.Duplex.Generic.Syntax ((/))
import Routing.Duplex.Parser (RouteError)
import Routing.Hash (getHash)
import UI.Navigation.Router.Page.Preferences as Preferences
import UI.Navigation.Router.Types (Route(..))
import Web.Router (RouterState(..))
import Web.Router as Router
import Web.Router.Driver.Hash as Hash
import Yoga.Block as Block
import Yoga.Block.Container.Style (DarkOrLightMode(..), getDarkOrLightMode, mkGlobal)
import Yoga.Block.Container.Style as Yoga

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
        , "Preferences": "preferences" / Preferences.subRoute
        }
