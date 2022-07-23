module UI.Navigation.Router where

import Prelude hiding ((/))

import Data.Either (Either, fromRight)
import Data.Newtype (class Newtype)
import Data.Tuple.Nested ((/\))
import Effect (Effect)
import Effect.Ref as Ref
import Effect.Unsafe (unsafePerformEffect)
import React.Basic.Hooks (JSX, UseContext, Hook)
import React.Basic.Hooks as React
import Routing.Duplex (RouteDuplex')
import Routing.Duplex as R
import Routing.Duplex.Generic as RG
import Routing.Duplex.Generic.Syntax ((/))
import Routing.Duplex.Parser (RouteError)
import Routing.Hash (getHash)
import UI.Navigation.Router.Page.Github as Github
import UI.Navigation.Router.Page.Preferences as Preferences
import UI.Navigation.Router.Types (Route(..))
import Web.Router (RouterState(..))
import Web.Router as Router
import Web.Router.Driver.Hash as Hash

type Router =
  { route ∷ Route
  , navigate ∷ Route → Effect Unit
  , redirect ∷ Route → Effect Unit
  }

newtype UseRouter ∷ Type → Type
newtype UseRouter hooks = UseRouter (UseContext Router hooks)

parseRoute ∷ String → Either RouteError Route
parseRoute = R.parse appRoute

printRoute ∷ Route → String
printRoute route = "#" <> R.print appRoute route

derive instance newtypeUseRouter ∷ Newtype (UseRouter hooks) _

useRouter ∷ Hook UseRouter Router
useRouter =
  React.coerceHook do
    React.useContext routerContext

routerContext ∷ React.ReactContext Router
routerContext = unsafePerformEffect do
  route ← getHash <#> parseRoute >>> fromRight Registry
  React.createContext { route, navigate: mempty, redirect: mempty }

mkRouter ∷ Effect (JSX → JSX)
mkRouter = do
  subscriberRef ← Ref.new mempty
  let driver = Hash.makeDriver parseRoute printRoute
  router ←
    Router.makeRouter
      (\_ _ → Router.continue)
      ( case _ of
          Transitioning _ _ → pure unit
          Resolved _ route → Ref.read subscriberRef >>= (_ $ route)
      )
      driver
  React.component "Router" \child → React.do
    currentRoute /\ setCurrentRoute ← React.useState' Home
    React.useEffect unit do
      Ref.write setCurrentRoute subscriberRef
      cleanup ← router.initialize
      pure do
        cleanup
        mempty
    pure
      $ React.provider routerContext
          { route: currentRoute
          , navigate: router.navigate
          , redirect: router.redirect
          }
          [ child ]

appRoute ∷ RouteDuplex' Route
appRoute =
  R.root
    $ RG.sum
        { "Home": RG.noArgs
        , "Solutions": "projects" / RG.noArgs
        , "Worksheet": "worksheet" / RG.noArgs
        , "Registry": "registry" / RG.noArgs
        , "Github": "github" / Github.subRoute
        , "Preferences": "preferences" / Preferences.subRoute
        }
