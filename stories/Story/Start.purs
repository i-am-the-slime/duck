module Story.Start (default, start) where

import Prelude

import Effect (Effect)
import React.Basic (JSX)
import Story.Ctx (defaultOnMessage, mkStoryCtx)
import Storybook (story)
import Storybook.Types (Story)
import UI.Component (runComponent)
import UI.Start as Start

default ∷ Story
default = story { title: "Start", decorators: [] }

start ∷ Effect JSX
start = do
  storyCtx ← mkStoryCtx defaultOnMessage
  runComponent storyCtx (Start.mkView) <@> unit
