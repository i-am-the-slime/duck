module Storybook.Types where

foreign import data Decorator ∷ Type

type Story = { title ∷ String, decorators ∷ Array Decorator }
