module Story.Editor where

import Prelude

import Data.Tuple.Nested ((/\))
import Effect (Effect)
import Fahrtwind (heightFull, widthFull)
import React.Basic (JSX)
import React.Basic.DOM as R
import React.Basic.Hooks as React
import Story.Util.Decorator (containerDecorator)
import Storybook (mkStoryWrapper)
import Storybook.Types (Story)
import UI.Editor as Editor
import Yoga ((</*>))

default ∷ Story
default = { title: "Editor", decorators: [ containerDecorator ] }

editor ∷ Effect JSX
editor = do
  mkStoryWrapper $ React.do
    _text /\ setText ← React.useState' ""
    { ref, setValue: _setValue } ← Editor.useMonaco "hey" setText
    pure $ R.div' </*>
      { className: "eddy"
      , css: widthFull <> heightFull
      , ref
      }
