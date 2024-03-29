module UI.OpenProject where

import Yoga.Prelude.View hiding (Component)

import Biz.IPC.Message.Types (MessageToMain(..))
import Data.Lens.Barlow (barlow)
import Data.Variant (match)
import Network.RemoteData (RemoteData(..))
import React.Basic.DOM as R
import React.Basic.Hooks as React
import Type.Prelude (Proxy(..))
import UI.Component (Component, component)
import UI.Ctx.Types (Ctx)
import UI.Hook.UseIPC (useIPC)
import UI.Project as Project
import Yoga.Block as Block
import Yoga.Block.Atom.Button.Types (ButtonType(..))

mkView ∷ Component Unit
mkView = do
  projectView ← Project.mkView
  component "OpenProject" \(ctx ∷ Ctx) _ → React.do
    { data: projectConfigRD, send: openFolder } ←
      useIPC ctx (barlow (Proxy ∷ Proxy ("%LoadSpagoProjectResponse")))

    let
      selectButton disabled = Block.centre_
        [ Block.button
            { onClick: handler preventDefault \_ → do
                openFolder LoadSpagoProject
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
          Failure _ → fragment
            [ selectButton false ]
          Success success →
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

      ]
