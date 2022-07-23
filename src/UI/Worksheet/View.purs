module UI.Worksheet.View where

import Yoga.Prelude.View

import Backend.Tool.Types (Tool(..))
import Biz.IPC.Message.Types (MessageToMain(..), MessageToRenderer(..))
import Data.Either (either)
import Data.Lens.Barlow (barlow)
import Data.Lens.Barlow.Helpers (preview, view)
import Fahrtwind (heightFull, height)
import Network.RemoteData as RD
import React.Basic.DOM as R
import React.Basic.Emotion as E
import React.Basic.Hooks as React
import UI.Component as UI
import UI.Editor (useMonaco)
import UI.Hook.UseIPCMessage (useIPC)
import UI.Notification.ErrorNotification (errorNotification)
import UI.Notification.SendNotification (notifyError, sendNotification)
import Yoga.Block as Block
import Yoga.Block.Icon.SVG.Spinner (spinner)

mkView ∷ UI.Component Unit
mkView = do
  UI.component "WorksheetView" \ctx _props → React.do
    textRef ← React.useRef ""
    editor ← useMonaco "" (React.writeRef textRef)

    loadFileIPC ← useIPC ctx (barlow @"%LoadTextFileResult")
    saveFileIPC ← useIPC ctx (barlow @"%StoreTextFileResult")
    runCodeIPC ← useIPC ctx (barlow @"%RunCommandResult")

    useEffectOnce do
      loadFileIPC.send (LoadTextFile "/tmp/duck-worksheet/src/Main.purs")
      mempty
    useEffect loadFileIPC.data do
      for_ (loadFileIPC.data) (traverse_ editor.setValue)
      mempty

    let
      saveButton = Block.button
        { onClick: handler_ do
            text ← React.readRef textRef
            saveFileIPC.send
              ( StoreTextFile
                  { path: "/tmp/duck-worksheet/src/Main.purs"
                  , content: text
                  }
              )
        }
        [ R.text "Save" ]

      runButton = Block.button
        { onClick: handler_ do
            runCodeIPC.send (RunCommand { tool: Spago, workingDir: Just "/tmp/duck-worksheet", args: [ "run" ] })
        }
        [ R.text "Run" ]

    pure $ Block.stack { css: heightFull }
      [ Block.cluster_
          [ saveButton, runButton ]
      , Block.sidebar
          { sidebar:
            runCodeIPC.data
              # case _ of
                  RD.NotAsked -> R.text "Go ahead run this"
                  RD.Loading -> spinner
                  RD.Success (Right r) -> R.text r
                  RD.Success (Left e) -> R.text e
                  RD.Failure _ -> mempty -- notifyError ctx e

          , sideWidth: "300px"
          }
          [ R.div' </* { ref: editor.ref, css: height 500 } /> [] ]
      ]
