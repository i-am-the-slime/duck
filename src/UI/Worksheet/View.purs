module UI.Worksheet.View where

import Yoga.Prelude.View

import Backend.Tool.Types (Tool(..))
import Biz.IPC.Message.Types (MessageToMain(..))
import Biz.OperatingSystem.Types (OperatingSystem(..))
import Data.Int.Bits ((.&.))
import Data.Lens.Barlow (barlow)
import Data.Lens.Barlow.Helpers (preview)
import Data.Set as Set
import Debug (spy)
import Effect.Aff (attempt)
import Effect.Class.Console as Console
import Fahrtwind (background', borderCol', borderLeft, height, heightFull, mXAuto, textCol', widthAndHeight)
import Monaco (Monaco, addCommand, keyCodeEnter, keyModCtrlCmd)
import Network.RemoteData as RD
import Plumage.Util.HTML as P
import React.Basic.DOM as R
import React.Basic.Hooks as React
import UI.Component as UI
import UI.Editor (useMonaco)
import UI.Hook.UseIPC (useIPC)
import UI.Hook.UseRemoteData (useRemoteData)
import UI.Notification.SendNotification (notifyError)
import UI.OperatingSystem (getOS)
import UI.Worksheet.Style as Style
import Web.Event.Event as Event
import Web.HTML.HTMLElement (click)
import Web.UIEvent.KeyboardEvent as KeyboardEvent
import Yoga.Block as Block
import Yoga.Block.Container.Style (col)
import Yoga.Block.Hook.Key as Key
import Yoga.Block.Hook.UseKeyDown (useKeyDown)
import Yoga.Block.Icon.SVG.Spinner (spinner)
import Yoga.Block.Layout.Sidebar.Style (SidebarSide(..))


mkView ∷ UI.Component Unit
mkView = do
  os <- getOS # liftEffect
  UI.component "WorksheetView" \ctx _props → React.do
    textRef ← React.useRef ""
    editor ← useMonaco "" (React.writeRef textRef)
    useEffectOnce do
      React.readRef editor.monacoRef >>= traverse_ \(m::Monaco) ->
        addCommand (keyCodeEnter .&. keyModCtrlCmd) (Console.log "Hihiih") m
      mempty
    buttonRef <- React.useRef null

    loadFileIPC ← useIPC ctx (barlow @"%LoadTextFileResult")
    saveAndRunIPC ← useRemoteData \content → attempt do
      errʔ ← ctx.sendIPCMessage
        (StoreTextFile { path: "/tmp/duck-worksheet/src/Main.purs", content })
        <#> (preview @"%StoreTextFileResult" >>> join)
      for_ errʔ (notifyError ctx) # liftEffect
      ctx.sendIPCMessage
        ( RunCommand
            { tool: Spago
            , workingDir: Just "/tmp/duck-worksheet"
            , args: [ "run" ]
            }
        ) <#> (preview @"%RunCommandResult" >>> note "Bug: Wrong response" >>> join)

    useEffectOnce do
      loadFileIPC.send (LoadTextFile "/tmp/duck-worksheet/src/Main.purs")
      mempty
    useEffect loadFileIPC.data do
      for_ (loadFileIPC.data) (traverse_ editor.setValue)
      mempty

    useKeyDown \ev modifiers key -> do
      let
        osModifier = case os of
          MacOS -> Key.Shift
          _ -> Key.Shift
      when (Set.member osModifier modifiers && key == Key.Return) do
        Event.preventDefault (KeyboardEvent.toEvent ev)
        Event.stopPropagation (KeyboardEvent.toEvent ev)
        getHTMLElementFromRef buttonRef >>= traverse_ \el -> do
          click el

    let
      runButton = Block.button
        { onClick: handler_ do
            text ← React.readRef textRef
            saveAndRunIPC.load text
        , css: Style.runButtonStyle
        , ref: buttonRef
        }
        [ P.div_ Style.buttonContentStyle
            [ R.div_ []
            , R.div_ [R.text "Run"]
            , P.div_ Style.shortcutStyle
                [ P.div_ (Style.keyStyle)
                  [ R.text case os of
                      MacOS -> "⌘"
                      _ -> "ctrl-"
                  ]
                , P.div_ (Style.keyStyle) [ R.text "↵" ]
                ]
            ]
        ]

    pure $ Block.stack { css: heightFull <> background' col.backgroundBright3 }
      [  Block.sidebar
          { space: "0"
          , sidebar:  P.div_ ( heightFull <> borderLeft 1 <> borderCol' col.backgroundLayer2) [
            Block.box_ [Block.stack_ [
              runButton ,
              saveAndRunIPC.data
                # case _ of
                    RD.NotAsked → R.text "Go ahead run this"
                    RD.Loading → P.div_ (widthAndHeight 24 <> mXAuto) [spinner]
                    RD.Success (Right {stdout, stderr}) →
                      Block.stack_ [
                        P.div_ mempty [R.text stdout]
                        , R.details_ [ P.div_ (textCol' col.invalid) [R.text stderr]]
                      ]
                    RD.Success (Left e) → R.text e
                    RD.Failure _ → mempty -- notifyError ctx e
               ]]]
          , sideWidth: "300px"
          , side: SidebarRight
          }
          [ R.div' </* { ref: editor.ref, css: height 500 } /> [] ]
      ]
