module Story.Util.Decorator where

import Prelude

import Storybook as Storybook
import Storybook.Types (Decorator)
import UI.Container (container)

containerDecorator :: Decorator
containerDecorator = Storybook.decorator
  (\x -> pure (container [ x ]))