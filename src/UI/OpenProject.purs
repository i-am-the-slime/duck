module UI.OpenProject where

import Yoga.Prelude.View hiding (Component)

import Biz.IPC.Message.Types (MessageToMain(..), MessageToRenderer(..))
import Data.Variant (match)
import Network.RemoteData (RemoteData(..))
import React.Basic.DOM as R
import React.Basic.Hooks as React
import UI.Component (Component, Ctx, component)
import UI.Hook.UseIPCMessage (useIPCMessage)
import UI.Project as Project
import Yoga.Block as Block
import Yoga.Block.Atom.Button.Types (ButtonType(..))

mkView ∷ Component Unit
mkView = do
  projectView ← Project.mkView
  component "OpenProject" \(ctx ∷ Ctx) _ → React.do
    openFolder /\ projectConfigRD ← useIPCMessage ctx

    let
      selectButton disabled = Block.centre_
        [ Block.button
            { onClick: handler preventDefault \_ → do
                openFolder ShowFolderSelector
            , buttonType: Primary
            , disabled
            }
            [ R.text "Select a folder" ]
        ]

    pure $ Block.box_
      [ R.h1_ [ R.text "Project" ]
      , case projectConfigRD of
          NotAsked → selectButton false
          Loading → selectButton true
          Failure e → fragment
            [ selectButton false, R.text $ "Failed! " <> show e ]
          Success (ShowFolderSelectorResponse success) →
            success # match
              { noSpagoDhall:
                  \_ → Block.stack_
                    [ selectButton false
                    , R.text "No spago.dhall in the selected folder"
                    ]
              , invalidSpagoDhall:
                  \_ → Block.stack_
                    [ selectButton false
                    , R.text "Invalid spago.dhall config!"
                    ]
              , nothingSelected: \_ → selectButton false
              , validSpagoDhall: projectView
              }
          Success _ → fragment
            [ selectButton false, R.text $ "Unexpected message" ]

      ]
