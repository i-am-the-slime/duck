module UI.Worksheet.View where

import Yoga.Prelude.View

import Backend.Tool.Types (Tool(..))
import Biz.IPC.Message.Types (MessageToMain(..))
import Biz.OperatingSystem.Types (OperatingSystem(..))
import Data.Int.Bits ((.|.))
import Data.Lens.Barlow (barlow)
import Data.Lens.Barlow.Helpers (preview)
import Effect.Aff (attempt)
import Fahrtwind (background', borderCol', borderLeft, height, heightFull, mXAuto, textCol', widthAndHeight)
import Monaco (addCommand, keyCodeEnter, keyModCtrlCmd)
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
import Web.Event.Event (Event, EventType(..))
import Web.Event.EventTarget (dispatchEvent)
import Web.HTML.Event.EventTypes (click)
import Web.HTML.Event.EventTypes as EventType
import Web.HTML.HTMLElement (click)
import Web.HTML.HTMLElement as HTMLElement
import Yoga.Block as Block
import Yoga.Block.Atom.Button.Types (ButtonType(..)) as Button
import Yoga.Block.Container.Style (col)
import Yoga.Block.Icon.SVG.Spinner (spinner)
import Yoga.Block.Layout.Sidebar.Style (SidebarSide(..))

foreign import newEvent :: EventType -> { bubbles :: Boolean } -> Effect Event

mkView ∷ UI.Component Unit
mkView = do
  os <- getOS # liftEffect
  UI.component "WorksheetView" \ctx _props → React.do
    textRef ← React.useRef ""
    editor ← useMonaco "" (React.writeRef textRef)
    buttonRef <- React.useRef null
    useEffectOnce do
      React.readRef editor.monacoRef >>= traverse_ \m -> m#
        addCommand (keyCodeEnter .|. keyModCtrlCmd) do
          getHTMLElementFromRef buttonRef >>= traverse_ \el -> do
            event <- newEvent (EventType.click) { bubbles: true }
            dispatchEvent event (HTMLElement.toEventTarget el)
      mempty

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

    let
      runButton = Block.button
        { onClick: handler_ do
            text ← React.readRef textRef
            saveAndRunIPC.load text
        , css: Style.runButtonStyle
        , buttonType: Button.Primary
        , ripple: "rgba(255,255,255, 0.2)"
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
                , P.div_ (Style.keyStyle) [
                    R.text "↩"
                ]
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
