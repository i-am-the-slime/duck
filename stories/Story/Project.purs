module Story.SelectFile (default, openProject, project) where

import Prelude

import Biz.IPC.SelectFolder.Types (SelectedFolderData, validSpagoDhall)
import Biz.Spago.Types (ProjectName(..), SourceGlob(..), ProjectConfig)
import Data.Array as Array
import Data.Foldable (for_, traverse_)
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Data.Tuple.Nested (type (/\), (/\))
import Effect (Effect)
import Effect.Ref as Ref
import Effect.Uncurried (EffectFn2, runEffectFn2)
import Electron.Types (Channel(..))
import ElectronAPI (ElectronListener)
import Foreign (Foreign)
import Foreign.Object as Object
import React.Basic (JSX)
import Story.Util.Decorator (containerDecorator)
import Storybook (story)
import Storybook.Types (Story)
import UI.Component (Ctx, runComponent)
import UI.OpenProject as OpenProject
import UI.Project as Project
import Unsafe.Coerce (unsafeCoerce)
import Unsafe.Reference (unsafeRefEq)
import Yoga.JSON as JSON

default :: Story
default = story { title: "Select Folder", decorators: [ containerDecorator ] }

mkStoryCtx :: OnMessage -> Effect Ctx
mkStoryCtx onMessage = do
  listenersRef <- Ref.new (Map.empty :: _ Channel (Array ElectronListener))
  let
    registerListener channel listener = do
      listenersRef # Ref.modify_
        ( flip Map.alter channel case _ of
            Just ls -> Just (Array.cons listener ls)
            Nothing -> Just [ listener ]
        )
    removeListener channel listener = do
      listenersRef # Ref.modify_
        ( flip Map.alter channel case _ of
            Just ls -> Just (Array.filter (unsafeRefEq listener) ls)
            Nothing -> Nothing
        )

    postMessage channel payload = do
      responseʔ <- onMessage channel payload
      for_ responseʔ \(responseChannel /\ responseMessage) -> do
        listenersRef # Ref.read >>= \listeners ->
          case Map.lookup responseChannel listeners of
            Just ls -> traverse_
              ( \listener ->
                  ( ( (unsafeCoerce listener)
                        :: EffectFn2 Foreign Foreign Unit
                    )
                      # runEffectFn2

                  ) responseMessage responseMessage
              )
              ls
            Nothing -> mempty
  pure
    { registerListener
    , removeListener
    , postMessage
    }

type OnMessage = Channel -> Foreign -> Effect (Maybe (Channel /\ Foreign))

exampleProject :: ProjectConfig
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
      , "some-dependency"
      , "some-dependency"
      , "some-dependency"
      , "some-dependency"
      , "some-dependency"
      , "some-dependency"
      , "some-dependency"
      ]
  , sources: [ SourceGlob "src/**/*.purs" ]
  , packages: Object.empty
  }

openProject :: Effect JSX
openProject = do
  storyCtx <- mkStoryCtx exampleOnMessage
  runComponent storyCtx
    ( OpenProject.mkView <@> unit
    )

exampleOnMessage :: OnMessage
exampleOnMessage channel fgn = do
  case channel, fgn of
    Channel "show-folder-selector", _ -> do
      pure <<< Just
        $ Channel "folder-selected" /\
            JSON.write response

    _, _ -> pure Nothing
  where
  response :: SelectedFolderData
  response =
    --nothingSelected
    validSpagoDhall exampleProject

project :: Effect JSX
project = do
  storyCtx <- mkStoryCtx exampleOnMessage
  runComponent storyCtx
    (Project.mkView <@> exampleProject)