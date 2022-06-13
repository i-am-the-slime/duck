module UI.OpenProject where

import Yoga.Prelude.View hiding (Component)

import Biz.IPC.SelectFolder.Types (SelectedFolderData)
import Data.Newtype (class Newtype)
import Data.Variant (match)
import Debug (spy)
import Electron.Types (Channel(..))
import ElectronAPI as ElectronAPI
import Foreign (MultipleErrors)
import Network.RemoteData (RemoteData(..))
import Network.RemoteData as RemoteData
import React.Basic.DOM as R
import React.Basic.Hooks as React
import UI.Component (Ctx, Component, component)
import UI.PostMessage (postMessage)
import UI.Project as Project
import Yoga.Block as Block
import Yoga.Block.Atom.Button.Types (ButtonType(..))
import Yoga.JSON (class ReadForeign, class WriteForeign, read)
import Yoga.JSON as JSON

useIPCMessage
  :: forall i o
   . WriteForeign i
  => ReadForeign o
  => Ctx
  -> Channel
  -> Channel
  -> Hook (UseIPCMessage o)
       ((i -> Effect Unit) /\ (RemoteData MultipleErrors o))
useIPCMessage
  { registerListener, removeListener, postMessage }
  toChannel
  fromChannel = coerceHook $
  React.do
    result /\ setResult <- React.useState' NotAsked
    useEffectOnce do
      listener <- ElectronAPI.mkListener $ \_ foreignMessage -> do
        let messageOrError = read foreignMessage
        messageOrError # (setResult <<< RemoteData.fromEither)
      registerListener fromChannel listener
      pure $ removeListener fromChannel listener
    let
      send msg = setResult Loading *> postMessage toChannel (JSON.write msg)
    pure (send /\ result)

newtype UseIPCMessage o hooks = UseIPCMessage
  (UseEffect Unit (UseState (RemoteData MultipleErrors o) hooks))

derive instance Newtype (UseIPCMessage o hooks) _

mkView :: Component Unit
mkView = do
  projectView <- Project.mkView
  component "OpenProject" \ctx _ -> React.do
    openFolder /\ (projectConfigRD :: _ SelectedFolderData) <-
      useIPCMessage ctx (Channel "show-folder-selector")
        (Channel "folder-selected")

    let
      selectButton disabled = Block.centre_
        [ Block.button
            { onClick: handler preventDefault \_ -> do
                openFolder {}
            , buttonType: Primary
            , disabled
            }
            [ R.text "Select a folder" ]
        ]

    pure $ Block.box_
      [ R.h1_ [ R.text "Project" ]
      , case spy "spei" projectConfigRD of
          NotAsked -> selectButton false
          Loading -> selectButton true
          Failure e -> fragment
            [ selectButton false, R.text $ "Failed! " <> show e ]
          Success success ->
            success # match
              { noSpagoDhall:
                  \_ -> Block.stack_
                    [ selectButton false
                    , R.text "No spago.dhall in the selected folder"
                    ]
              , invalidSpagoDhall:
                  \_ -> Block.stack_
                    [ selectButton false
                    , R.text "Invalid spago.dhall config!"
                    ]
              , nothingSelected: \_ -> selectButton false
              , validSpagoDhall: projectView
              }

      ]
