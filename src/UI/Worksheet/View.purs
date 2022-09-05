module UI.Worksheet.View where

import Yoga.Prelude.View

import Backend.Tool.Types (Tool(..))
import Biz.IPC.Message.Types (MessageToMain(..), MessageToRenderer(..), RunCommandUpdate(..))
import Biz.OperatingSystem.Types (OperatingSystem(..))
import Data.Int.Bits ((.|.))
import Data.Lens.Barlow (barlow)
import Data.Lens.Barlow.Helpers (preview)
import Data.String as String
import Debug (spy)
import Effect.Aff (launchAff_)
import Fahrtwind (background', borderCol', borderLeft, fontFamilyOrMono, height, heightFull, mXAuto, maxWidth, overflowYScroll, textCol', textSm, width, widthAndHeight)
import Monaco (addCommand, keyCodeEnter, keyModCtrlCmd)
import Network.RemoteData as RD
import Plumage.Util.HTML as P
import React.Basic.DOM as R
import React.Basic.Emotion (css)
import React.Basic.Emotion as E
import React.Basic.Hooks as React
import UI.Component as UI
import UI.Editor (useMonaco)
import UI.Hook.UseIPC (useIPC)
import UI.Notification.SendNotification (notifyError)
import UI.OperatingSystem (getOS)
import UI.Worksheet.Style as Style
import Web.Event.Event (Event, EventType)
import Web.Event.EventTarget (dispatchEvent)
import Web.HTML.Event.EventTypes as EventType
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
    result  /\ setResult <- React.useState (RD.NotAsked:: (RD.RemoteData _ { stdout :: String, stderr :: String, done :: Maybe Boolean }))
    let
     saveAndRun content = do
      errʔ ← ctx.sendIPCMessage
        (StoreTextFile { path: "/tmp/duck-worksheet/src/Main.purs", content })
        <#> (preview @"%StoreTextFileResult" >>> join)
      do
        setResult (const RD.Loading) # liftEffect
        for_ errʔ (notifyError ctx) # liftEffect
        ctx.streamIPCMessage
          ( RunCommand
              { tool: Spago
              , workingDir: Just "/tmp/duck-worksheet"
              , args: [ "run" ]
              }
          )
          \msg -> do
            case preview @"%RunCommandUpdateResult" msg of
              Nothing -> setResult (const $ RD.Failure ("Unexpected message"))
              Just (StdoutData s) ->
                setResult case _ of
                  RD.Success d -> RD.Success (d { stdout = d.stdout <> s })
                  _ -> RD.Success { stdout: s, stderr: "", done: Nothing}
              Just (StderrData s) ->
                setResult case _ of
                  RD.Success d -> RD.Success (d { stderr = d.stderr <> s })
                  _ -> RD.Success { stdout: "", stderr: s, done: Nothing}
              Just (CommandFinished succeeded) ->
                setResult case _ of
                  RD.Success d -> RD.Success (d { done = Just succeeded })
                  _ -> RD.Success { stdout: "", stderr: "", done: Just succeeded}

    useEffectOnce do
      loadFileIPC.send (LoadTextFile "/tmp/duck-worksheet/src/Main.purs")
      mempty

    startLS <- useIPC ctx (barlow @"%StartPureScriptLanguageServerResponse")
    useEffectOnce do
      startLS.send (StartPureScriptLanguageServer { folder: "/tmp/duck-worksheet/" })
      mempty


    useEffect loadFileIPC.data do
      for_ (loadFileIPC.data) (traverse_ editor.setValue)
      mempty

    let
      runButton = Block.button
        { onClick: handler_ do
            text ← React.readRef textRef
            launchAff_ $ saveAndRun text
        , css: Style.runButtonStyle
        , buttonType: Button.Primary
        , ripple: "rgba(255,255,255, 0.2)"
        , ref: buttonRef
        }
        [ P.div_ Style.buttonContentStyle
            [ R.div_ []
            , R.div_ [ R.text "Run"]
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
          , sidebar:  P.div_ ( heightFull <> borderLeft 1 <> borderCol' col.backgroundLayer2 <> width 300) [
            Block.box_ [Block.stack_ [
              runButton,
              result
                # case _ of
                    RD.NotAsked → R.text "Go ahead run this"
                    RD.Loading → P.div_ (widthAndHeight 24 <> mXAuto) [spinner]
                    RD.Success {stdout, stderr, done} →
                      P.div_ (maxWidth 300) [
                        Block.stack_ [
                          guard (done == Nothing)  (P.div_ (widthAndHeight 24 <> mXAuto) [spinner])
                         , P.div_ mempty [R.text stdout]
                          , R.details' </ { open: done /= Just true } /> [
                            P.div_ (textSm <> overflowYScroll <> height 400 <> guard (done == Just false) (textCol' col.invalid) <>  fontFamilyOrMono "Jetbrains Mono") [
                            P.div_ (css { whiteSpace: E.str "pre-wrap"}) [
                            R.text (stderr
                            # String.replaceAll (String.Pattern "\\n") (String.Replacement "\n")
                            # String.replaceAll (String.Pattern "\\") (String.Replacement "")
                            )]
                            ]
                            ]
                        ]
                      ]
                    RD.Failure _ → mempty -- notifyError ctx e
               ]]]
          , sideWidth: "300px"
          , side: SidebarRight
          }
          [ R.div' </* { ref: editor.ref, css: height 500 } /> [] ]
      ]
