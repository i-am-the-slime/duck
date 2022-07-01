module UI.Tools where

import Yoga.Prelude.View

import Backend.Tool.Types (Tool, ToolPath(..), ToolWithPath)
import Backend.Tool.Types as Tool
import Data.Time.Duration (Milliseconds(..))
import Effect.Class.Console as Console
import Fahrtwind (background, background', border, borderCol, borderCol', flexCol, green, mB, pX, pY, roundedDefault, roundedFull, roundedMd, shadowMd, textCol', textLg, textSm, widthAndHeight, yellow)
import Fahrtwind.Icon.Heroicons as Heroicon
import Plumage.Util.HTML as H
import React.Basic.DOM as R
import React.Basic.Emotion as E
import UI.Component as UI
import UI.FilePath (renderFilePath)
import UI.Tooltip (withTextTooltip)
import Yoga.Block as Block
import Yoga.Block.Atom.Button.Types as Button
import Yoga.Block.Container.Style (col)
import Yoga.Block.Organism.NotificationCentre.Notification.View (autoHideNotification)
import Yoga.Block.Organism.NotificationCentre.Types (NotificationCentre(..))

mkView ∷ UI.Component (Array ToolWithPath)
mkView = do
  UI.component "Project" \{ notificationCentre } tools → React.do
    pure $ Block.stack { space: E.px 8 }
      (tools <#> renderTool notificationCentre)

renderTool ∷ NotificationCentre → (Tool /\ Maybe ToolPath) → JSX
renderTool (NotificationCentre { enqueueNotification }) (tool /\ toolPathʔ) =
  H.div_
    ( border 1 <> roundedMd
        <> background' col.backgroundLayer5
        <> borderCol' col.backgroundBright6
        <> textCol' col.textPaler1
        <> pX 16
        <> pY 8
        <> shadowMd
    )
    [ Block.cluster { justify: "space-between" }
        [ H.div_ (flexCol)
            [ R.code' </* { css: textLg } /> [ tool # Tool.toCommand # R.text ]
            , Block.cluster
                { space: "4px"
                , css: textCol' col.textPaler3
                , align: "flex-end"
                }
                [ H.span_ (textSm)
                    [ tool # Tool.toName # R.text ]
                , H.div_ (widthAndHeight 18 <> mB 2)
                    [ Heroicon.questionMarkCircle
                    ] # withTextTooltip "Hi"

                ]
            ]
        , Block.cluster_
            [ case toolPathʔ of
                Just (ToolPath p) → renderFilePath p
                Nothing →
                  Block.button
                    { buttonShape: Button.Flat
                    , onClick: handler_ do
                        enqueueNotification $ autoHideNotification
                          { title: "I'm not really installing anything"
                          , body: fragment []
                          , autoHideAfter: 3000.0 # Milliseconds
                          }
                    }
                    [ R.text "Install"
                    ]
            , Block.box
                { padding: E.px 5
                , css: roundedFull
                    <> border 1
                    <>
                      if toolPathʔ # isJust then
                        ( background green._400
                            <> borderCol green._600
                        )
                      else
                        ( background yellow._400
                            <> borderCol yellow._600
                        )
                }
                []
            ]
        ]
    ]

-- toolInfoTooltip ∷ Tool → JSX
-- toolInfoTooltip = Tool
