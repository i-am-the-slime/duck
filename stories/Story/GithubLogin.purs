module Story.GithubLogin (default, githubLogin, instructions) where

import Prelude

import Biz.Github.Types (UserCode(..), VerificationURI(..))
import Data.Tuple.Nested ((/\))
import Effect (Effect)
import React.Basic (JSX)
import React.Basic.Hooks as React
import Story.Ctx (defaultOnMessage, mkStoryCtx)
import Story.Util.Decorator (containerDecorator)
import Storybook (story)
import Storybook.Types (Story)
import UI.Component (runComponent)
import UI.Component as UI
import UI.GithubLogin (renderInstructions)
import UI.GithubLogin as GithubLogin

default ∷ Story
default = story { title: "Github Login", decorators: [ containerDecorator ] }

githubLogin ∷ Effect JSX
githubLogin = do
  storyCtx ← mkStoryCtx defaultOnMessage
  runComponent storyCtx GithubLogin.mkGithubLogin <@> { onComplete: mempty }

instructions ∷ Effect JSX
instructions = pure $
  renderInstructions
    mempty
    (UserCode "1234-5464")
    (VerificationURI "https://github.com/token/verify")