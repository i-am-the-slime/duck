module Storybook (decorator, story) where

import Prelude
import Effect (Effect)
import Effect.Uncurried (EffectFn1, mkEffectFn1)
import Prim.Row (class Union)
import React.Basic (JSX)
import Storybook.Types (Decorator, Story)
import Unsafe.Coerce (unsafeCoerce)

decorator ∷ (JSX → Effect JSX) → Decorator
decorator fn = toDecorator (mkEffectFn1 (_ >>= fn))

toDecorator ∷ (EffectFn1 (Effect JSX) JSX) → Decorator
toDecorator = unsafeCoerce

type StoryProps = (title ∷ String, decorators ∷ Array Decorator)

story ∷ ∀ p p_. Union p p_ StoryProps ⇒ { title ∷ String | p } → Story
story = unsafeCoerce
