module Story.SideBar (default, sideBar) where

import Prelude

import Effect (Effect)
import React.Basic (JSX)
import React.Basic.Hooks as React
import Story.Util.Decorator (containerDecorator)
import Storybook (story)
import Storybook.Types (Story)
import UI.Navigation.Router.Types (Route(..))
import UI.Navigation.SideBar as SideBar

default ∷ Story
default = story { title: "SideBar", decorators: [ containerDecorator ] }

sideBar ∷ Effect JSX
sideBar = do
  compo ← do
    view ← SideBar.mkPresentationalView
    React.component "Helper" \_ → React.do
      state ← React.useState' Home
      pure (view state)
  pure (compo unit)