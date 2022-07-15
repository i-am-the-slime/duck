module Story.Registry (default, registry) where

import Prelude

import Effect (Effect)
import React.Basic (JSX)
import React.Basic.DOM as R
import Story.Ctx (defaultOnMessage, mkStoryCtx)
import Story.Util.Decorator (containerDecorator)
import Storybook (story)
import Storybook.Types (Story)
import UI.Component (runComponent)
import UI.Registry as Registry

default ∷ Story
default = story { title: "Registry", decorators: [ containerDecorator ] }

registry ∷ Effect JSX
registry = do
  storyCtx ← mkStoryCtx defaultOnMessage
  compo ← runComponent storyCtx Registry.mkView
  pure $ R.div
    { children: [ compo unit ]
    }
