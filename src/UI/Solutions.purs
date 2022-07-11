module UI.Solutions where

import Yoga.Prelude.View hiding (Component)

import Biz.IPC.Message.Types (MessageToMain(..), MessageToRenderer(..))
import Biz.PureScriptSolutionDefinition.Types (PureScriptSolutionDefinition)
import Fahrtwind (divideY, mT, pL, pR, text2xl, textCol', widthAndHeight)
import Fahrtwind.Icon.Heroicons as Heroicons
import Fahrtwind.Style.Divide (divideCol')
import Network.RemoteData as RD
import Plumage.Util.HTML as P
import React.Basic.DOM as R
import React.Basic.Emotion as E
import React.Basic.Hooks as React
import UI.Block.Card (clickableCard)
import UI.Component (Component, component)
import UI.Ctx.Types (Ctx)
import UI.FilePath (renderFilePath)
import UI.Hook.UseIPCMessage (useIPCMessage)
import Yoga.Block as Block
import Yoga.Block.Atom.Button.Types as Button
import Yoga.Block.Container.Style (col)

mkView ∷ Component Unit
mkView = do
  component "Solutions" \(ctx ∷ Ctx) _ → React.do
    (solutionsRD ∷ _ MessageToRenderer) /\ getPreferences /\ _ ←
      useIPCMessage ctx

    useEffectOnce do
      getPreferences GetPureScriptSolutionDefinitions
      mempty

    let title = R.h1' </* { css: text2xl } /> [ R.text "Solutions" ]
    let
      toolbarIcon text icon action =
        Block.button
          { buttonType: Button.Generic
          , onClick: handler_ action
          , css: pL 8 <> pR 12 <> textCol' col.text
          }
          [ Block.cluster { space: "4px" }
              [ P.div_ (widthAndHeight 16) [ icon ], R.text text ]
          ]
    let
      toolbar = Block.cluster_
        [ toolbarIcon "New solution" Heroicons.plus mempty
        ]

    let
      topBar = Block.cluster { justify: "space-between" }
        [ title
        , toolbar
        ]

    pure $ Block.box_
      [ Block.stack
          { space: E.px 12
          , css: divideY 1 <> divideCol' col.backgroundBright5
          }
          [ topBar
          , P.div_ (mT 12)
              [ solutionsRD # case _ of
                  RD.NotAsked → R.text "Jo, dann mach mal"
                  RD.Loading → R.text "Warte!"
                  RD.Success (GetPureScriptSolutionDefinitionsResponse as) →
                    R.ul_ (renderSolution <$> as)

                  RD.Success _ → R.text $ "wrong message"
                  RD.Failure _ → mempty
              ]
          ]
      ]

renderSolution ∷ (String /\ PureScriptSolutionDefinition) → JSX
renderSolution (path /\ { name }) =
  R.li' </ { key: path } />
    [ clickableCard mempty -- [TODO]
        [ Block.stack { space: E.var "--s-1" }
            [ R.h2' </* { css: mempty } /> [ R.text name ]
            , renderFilePath path
            ]
        ]
    ]
