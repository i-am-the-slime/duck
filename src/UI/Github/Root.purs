module UI.Github.Root where

import Yoga.Prelude.View
import React.Basic.Hooks as React
import React.Basic.DOM as R
import React.Basic.Emotion as E

type Props = {}

mkView ∷ React.Component Props
mkView = do
  React.component "GithubRoot" \props → React.do
    let {} = props
    pure $ R.div' </* { className: "duck-github-root", css: E.css {} } />
      [ R.text "Hello" ]
