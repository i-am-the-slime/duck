module Story.Project (default, openProject, project) where

import Prelude

import Biz.IPC.Message.Types (MessageToMain(..), MessageToRenderer(..))
import Biz.IPC.SelectFolder.Types (SelectedFolderData, validSpagoDhall)
import Biz.Spago.Types (ProjectName(..), SourceGlob(..))
import Data.Maybe (Maybe(..))
import Dhall.Types (LocalImport(..))
import Effect (Effect)
import React.Basic (JSX)
import Spago.SpagoDhall.Types (SpagoDhall)
import Story.Ctx (mkStoryCtx)
import Story.Ctx.Types (OnMessage)
import Story.Util.Decorator (containerDecorator)
import Storybook (story)
import Storybook.Types (Story)
import UI.Component (runComponent)
import UI.OpenProject as OpenProject
import UI.Project as Project

default ∷ Story
default = story { title: "Select Folder", decorators: [ containerDecorator ] }

exampleProject ∷ SpagoDhall
exampleProject =
  { leadingComment: Nothing
  , name: ProjectName "my-project"
  , repository: Nothing
  , license: Nothing
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
  , packages: LocalImport "./packages.dhall"
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
