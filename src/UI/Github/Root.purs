module UI.Github.Root where

import Yoga.Prelude.View

import React.Basic.DOM as R
import React.Basic.Emotion as E
import UI.Component as UI

type Props = {}

mkView ∷ UI.Component Props
mkView = do
  UI.component "GithubRoot" \ctx props → React.do
    let {} = props
    pure $ R.div' </* { className: "duck-github-root", css: E.css {} } />
      [ R.text "Hello" ]
