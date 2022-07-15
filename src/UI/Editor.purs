module UI.Editor where

import Yoga.Prelude.View

import Control.Monad.Rec.Class (forever)
import Data.Newtype (class Newtype)
import Effect.Aff (Milliseconds(..))
import Effect.Aff as Aff
import Effect.Ref as Ref
import Monaco (Monaco, defineTheme, getValue, horizonTheme, nightOwlTheme, purescriptSyntax, registerLanguage, setMonarchTokensProvider)
import Monaco as Monaco
import React.Basic.Hooks as React
import React.Basic.Hooks.Aff (UseAff, useAff)
import UI.Navigation.ThemeSwitcher (UseTheme, useTheme)
import Web.DOM.ResizeObserver (resizeObserver)
import Web.DOM.ResizeObserver as ResizeObserver
import Web.HTML.HTMLElement as HTMLElement
import Yoga.Block.Container.Style (DarkOrLightMode(..))

newtype UseMonaco hooks = UseMonaco
  ( UseEffect DarkOrLightMode
      ( UseAff Unit Unit
          ( UseEffect Unit
              ( UseTheme
                  ( UseRef (Maybe Monaco)
                      ( UseRef (Nullable Node)
                          hooks
                      )
                  )
              )
          )
      )
  )

derive instance Newtype (UseMonaco hooks) _

useMonaco ∷
  String →
  (String → Effect Unit) →
  React.Hook UseMonaco { ref ∷ NodeRef, setValue ∷ String → Effect Unit }
useMonaco initialValue onChange = coerceHook React.do
  ref ← React.useRef null
  monacoRef ← React.useRef Nothing
  { theme } ← useTheme

  React.useEffectOnce do
    htmlElementʔ ← getHTMLElementFromRef ref
    case htmlElementʔ of
      Just htmlElement → do
        editor ← Monaco.editor
        initEditor
        monaco ← editor # Monaco.createEditor
          { value: initialValue
          , language: "purescript"
          , minimap: { enabled: false }
          , fontFamily: "Jetbrains Mono"
          , fontSize: "14"
          , fontLigatures: true
          , renderWhitespace: "none"
          , smoothScrolling: true
          , lineNumbers: "off"
          , glyphMargin: false
          , folding: false
          , lineDecorationsWidth: 0
          , lineNumbersMinChars: 0
          , scrollBeyondLastLine: false
          , hideCursorInOverviewRuler: true
          , overviewRulerBorder: false
          , renderLineHighlightOnlyWhenFocus: true
          , scrollbar: { alwaysConsumeMouseWheel: false }
          , renderLineHighlight: "none"
          , wordWrap: "off"
          }
          htmlElement

        React.writeRef monacoRef (Just monaco)

        -- resize observer
        observer ← resizeObserver \_ _ → do
          -- Monaco.editor >>= Monaco.remeasureFonts
          Monaco.layout monaco
        let element = HTMLElement.toElement htmlElement
        ResizeObserver.observe element ResizeObserver.ContentBox observer
        pure $ ResizeObserver.unobserve element observer
      Nothing →
        mempty

  useAff unit do
    monacoʔ ← React.readRef monacoRef # liftEffect
    lastSentValueRef ← Ref.new initialValue # liftEffect
    for_ monacoʔ \monaco → do
      forever do
        Aff.delay (250.0 # Milliseconds)
        liftEffect do
          lastSentValue ← Ref.read lastSentValueRef
          v ← monaco # getValue
          when (v /= lastSentValue) do
            onChange v
            Ref.write v lastSentValueRef

  React.useEffect theme do
    case theme of
      LightMode → Monaco.setTheme lightThemeName
      DarkMode → Monaco.setTheme darkThemeName
    mempty

  let
    setValue s = do
      React.readRef monacoRef >>= traverse_ (Monaco.setValue s)

  pure $ { ref, setValue }

darkThemeName ∷ String
darkThemeName = "NightOwl"

lightThemeName ∷ String
lightThemeName = "Horizon"

initEditor ∷ Effect Unit
initEditor = do
  editor ← Monaco.editor
  defineTheme editor darkThemeName (nightOwlTheme "#1D2630") -- [TODO] Read from somewhere else
  defineTheme editor lightThemeName (horizonTheme "#F1F3F5") -- [TODO] Don't hardcode
  registerLanguage "purescript"
  setMonarchTokensProvider "purescript" purescriptSyntax