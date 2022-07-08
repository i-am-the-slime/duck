module Story.Preferences (default, tools) where

import Prelude

import Backend.Tool.Types (Tool(..), ToolPath(..))
import Biz.IPC.Message.Types (MessageToMain(..), MessageToRenderer(..))
import Biz.IPC.SelectFolder.Types (SelectedFolderData, validSpagoDhall)
import Biz.Spago.Types (ProjectConfig, ProjectName(..), Repository(..), SourceGlob(..), Version(..))
import Data.Enum (enumFromTo)
import Data.Maybe (Maybe(..))
import Data.Tuple.Nested ((/\))
import Effect (Effect)
import Foreign.Object as Object
import React.Basic (JSX)
import Story.Ctx (defaultOnMessage, mkStoryCtx)
import Story.Ctx.Types (OnMessage)
import Story.Util.Decorator (containerDecorator)
import Storybook (story)
import Storybook.Types (Story)
import UI.Component (runComponent)
import UI.Navigation.Router.Page.Preferences as PreferencesRoute
import UI.Preferences as Preferences

default ∷ Story
default = story { title: "Preferences", decorators: [ containerDecorator ] }

exampleProject ∷ ProjectConfig
exampleProject =
  { name: ProjectName "my-project"
  , repository: Nothing
  , dependencies: ProjectName <$>
      [ "some-dependency"
      , "some-dependency"
      , "some-dependency"
      , "some-dependency"
      , "some-dependency"
      , "some-dependency"
      , "some-dependency"
      , "some-dependency"
      ]
  , sources: [ SourceGlob "src/**/*.purs" ]
  , packages: Object.fromHomogeneous
      { "some-dependency":
          { dependencies: []
          , repo: Repository
              "https://github.com/rowtype-yoga/purescript-fahrtwind.git"
          , version: Version "v1.0.0"
          }

      }
  }

tools ∷ Effect JSX
tools = do
  storyCtx ← mkStoryCtx defaultOnMessage
  runComponent storyCtx
    ( Preferences.mkView <@> PreferencesRoute.Root
    )