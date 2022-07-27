module Story.Project (default, openProject, project) where

import Prelude

import Biz.Github.Types (Repository(..))
import Biz.IPC.Message.Types (MessageToMain(..), MessageToRenderer(..))
import Biz.IPC.SelectFolder.Types (SelectedFolderData, validSpagoDhall)
import Biz.Spago.Types (ProjectConfig, ProjectName(..), SourceGlob(..), Version(..))
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Foreign.Object as Object
import React.Basic (JSX)
import Story.Ctx (mkStoryCtx)
import Story.Ctx.Types (OnMessage)
import Story.Util.Decorator (containerDecorator)
import Storybook.Types (Story)
import UI.Component (runComponent)
import UI.OpenProject as OpenProject
import UI.Project as Project

default ∷ Story
default = { title: "Select Folder", decorators: [ containerDecorator ] }

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
exampleOnMessage = case _ of
  LoadSpagoProject → do
    pure <<< Just $ LoadSpagoProjectResponse response
  _ → pure Nothing

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
