module Story.SelectFile (default, tools) where

import Prelude

import Backend.Tool.Types (Tool(..), ToolPath(..))
import Biz.IPC.Message.Types (MainToRendererChannel(..), RendererToMainChannel(..))
import Biz.IPC.SelectFolder.Types (SelectedFolderData, validSpagoDhall)
import Biz.Spago.Types (ProjectConfig, ProjectName(..), Repository(..), SourceGlob(..), Version(..))
import Data.Enum (enumFromTo)
import Data.Maybe (Maybe(..))
import Data.Tuple.Nested ((/\))
import Effect (Effect)
import Foreign.Object as Object
import React.Basic (JSX)
import Story.Ctx (OnMessage, mkStoryCtx)
import Story.Util.Decorator (containerDecorator)
import Storybook (story)
import Storybook.Types (Story)
import UI.Component (runComponent)
import UI.Tools as Tools
import Yoga.JSON as JSON

default ∷ Story
default = story { title: "Tools", decorators: [ containerDecorator ] }

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

exampleOnMessage ∷ OnMessage
exampleOnMessage channel fgn = do
  case channel, fgn of
    ShowFolderSelectorChannel, _ → do
      pure <<< Just $ ShowFolderSelectorResponseChannel /\ JSON.write response
    _, _ → pure Nothing

  where
  response ∷ SelectedFolderData
  response = validSpagoDhall exampleProject

tools ∷ Effect JSX
tools = do
  storyCtx ← mkStoryCtx exampleOnMessage
  runComponent storyCtx
    ( Tools.mkView <@>
        ( enumFromTo bottom top <#> \tool → tool /\ case tool of
            NPM → Just (ToolPath "/opt/homebrew/bin/npm")
            Spago → Just (ToolPath "/Users/mark/.local/bin/spago")
            Purs → Just (ToolPath "/Users/mark/.local/bin/purs")
            DhallToJSON → Nothing
        )
    )