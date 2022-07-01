module Story.Project (default, openProject, project) where

import Prelude

import Biz.IPC.Message.Types (MainToRendererChannel(..), RendererToMainChannel(..))
import Biz.IPC.SelectFolder.Types (SelectedFolderData, validSpagoDhall)
import Biz.Spago.Types (ProjectConfig, ProjectName(..), Repository(..), SourceGlob(..), Version(..))
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
import UI.OpenProject as OpenProject
import UI.Project as Project
import Yoga.JSON as JSON

default ∷ Story
default = story { title: "Select Folder", decorators: [ containerDecorator ] }

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

openProject ∷ Effect JSX
openProject = do
  storyCtx ← mkStoryCtx exampleOnMessage
  runComponent storyCtx
    ( OpenProject.mkView <@> unit
    )

exampleOnMessage ∷ OnMessage
exampleOnMessage channel fgn = do
  case channel, fgn of
    ShowFolderSelectorChannel, _ → do
      pure <<< Just $ ShowFolderSelectorResponseChannel /\ JSON.write response
    _, _ → pure Nothing

  where
  response ∷ SelectedFolderData
  response =
    --nothingSelected
    validSpagoDhall exampleProject

project ∷ Effect JSX
project = do
  storyCtx ← mkStoryCtx exampleOnMessage
  runComponent storyCtx
    (Project.mkView <@> exampleProject)