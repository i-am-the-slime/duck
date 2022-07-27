module Story.Preferences (default, tools) where

import Prelude

import Effect (Effect)
import React.Basic (JSX)
import Story.Ctx (defaultOnMessage, mkStoryCtx)
import Story.Util.Decorator (containerDecorator)
import Storybook.Types (Story)
import UI.Component (runComponent)
import UI.Navigation.Router.Page.Preferences as PreferencesRoute
import UI.Preferences as Preferences

default ∷ Story
default = { title: "Preferences", decorators: [ containerDecorator ] }

tools ∷ Effect JSX
tools = do
  storyCtx ← mkStoryCtx defaultOnMessage
  runComponent storyCtx
    ( Preferences.mkView <@> PreferencesRoute.Root
    )
