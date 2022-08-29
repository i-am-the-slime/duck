module Story.HeaderBar (default, headerBar) where

import Prelude

import Data.Maybe (Maybe(..))
import Effect (Effect)
import React.Basic (JSX)
import React.Basic.DOM as R
import Story.Util.Decorator (containerDecorator)
import Storybook (story)
import Storybook.Types (Story)
import UI.Navigation.HeaderBar as HeaderBar
import UI.Navigation.Router.Types (Route(..))

default ∷ Story
default = story { title: "HeaderBar", decorators: [ containerDecorator ] }

headerBar ∷ Effect JSX
headerBar = HeaderBar.mkPresentationalView <@>
  { route: Home, topRight: Just (R.text "i-am-the-slime") }
