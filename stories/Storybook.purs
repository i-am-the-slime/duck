module Storybook (decorator, mkStoryWrapper) where

import Prelude

import Effect (Effect)
import Effect.Uncurried (EffectFn1, mkEffectFn1)
import Effect.Unsafe (unsafePerformEffect)
import Prim.Row (class Union)
import React.Basic (JSX)
import React.Basic.Hooks as React
import Storybook.Types (Decorator, Story)
import Unsafe.Coerce (unsafeCoerce)

decorator ∷ (JSX → Effect JSX) → Decorator
decorator fn = toDecorator (mkEffectFn1 (_ >>= fn))

toDecorator ∷ (EffectFn1 (Effect JSX) JSX) → Decorator
toDecorator = unsafeCoerce

type StoryProps = (title ∷ String, decorators ∷ Array Decorator)

mkStoryWrapper ∷ ∀ hooks. React.Render Unit hooks JSX → Effect JSX
mkStoryWrapper doThis = (_ $ unit) <$> React.component "StoryWrapper"
  \(_ ∷ Unit) → doThis
