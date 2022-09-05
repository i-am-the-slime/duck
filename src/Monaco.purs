module Monaco where

import Prelude

import Control.Promise (Promise)
import Effect (Effect)
import Prim.Row (class Union)
import Web.HTML (HTMLElement)

foreign import data Monaco ∷ Type
foreign import data Editor ∷ Type
foreign import data MonacoTheme ∷ Type

type MonacoOptions =
  ( folding ∷ Boolean
  , fontFamily ∷ String
  , fontLigatures ∷ Boolean
  , fontSize ∷ String
  , glyphMargin ∷ Boolean
  , hideCursorInOverviewRuler ∷ Boolean
  , lineDecorationsWidth ∷ Int
  , renderWhitespace ∷ String
  , lineNumbers ∷ String
  , lineNumbersMinChars ∷ Int
  , minimap ∷ { enabled ∷ Boolean }
  , smoothScrolling ∷ Boolean
  , overviewRulerBorder ∷ Boolean
  , renderLineHighlight ∷ String
  , renderLineHighlightOnlyWhenFocus ∷ Boolean
  , scrollBeyondLastLine ∷ Boolean
  , scrollbar ∷ { alwaysConsumeMouseWheel ∷ Boolean }
  , value ∷ String
  , wordWrap ∷ String
  , language ∷ String
  )

foreign import createEditorImpl ∷
  ∀ r. { | r } → HTMLElement → Editor → Effect Monaco

foreign import colorizeImpl ∷
  String → String → { tabSize ∷ Int } → Editor → Effect (Promise String)

foreign import data MonarchLanguage ∷ Type

foreign import purescriptSyntax ∷ MonarchLanguage

foreign import registerLanguage ∷ String → Effect Unit

foreign import registerCompletionItemProviderImpl ∷ String → Effect Unit

foreign import setMonarchTokensProvider ∷
  String → MonarchLanguage → Effect Unit

foreign import editor ∷ Effect Editor

foreign import defineTheme ∷ Editor → String → MonacoTheme → Effect Unit

foreign import setTheme ∷ String → Effect Unit

foreign import nightOwlTheme ∷ String → MonacoTheme

foreign import horizonTheme ∷ String → MonacoTheme

foreign import layout ∷ Monaco → Effect Unit

foreign import remeasureFonts ∷ Editor → Effect Unit

createEditor ∷
  ∀ r r_.
  Union r r_ MonacoOptions ⇒
  { | r } →
  HTMLElement →
  Editor →
  Effect Monaco
createEditor = createEditorImpl

foreign import getValue ∷ Monaco → Effect String
foreign import setValue ∷ String → Monaco → Effect Unit

foreign import keyModCtrlCmd ∷ Int
foreign import keyModShift ∷ Int
foreign import keyModAlt ∷ Int
foreign import keyModWinCtrl ∷ Int

foreign import keyCodeEnter ∷ Int
foreign import addCommand ∷
  Int →
  (Effect Unit) →
  Monaco →
  Effect Unit
