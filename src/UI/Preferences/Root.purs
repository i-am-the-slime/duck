module UI.Preferences.Root where

import Yoga.Prelude.View

import Backend.Tool.Types (Tool(..), ToolPath(..), ToolWithPath)
import Backend.Tool.Types as Tool
import Biz.IPC.GetInstalledTools.Types (GetInstalledToolsResult(..))
import Biz.IPC.Message.Types (MessageToMain(..), MessageToRenderer(..))
import Data.Foldable (for_)
import Data.Maybe (Maybe(..))
import Data.Time.Duration (Milliseconds(..))
import Fahrtwind (background, border, borderCol, flexCol, green, mB, roundedFull, textCol', textLg, textSm, widthAndHeight, yellow)
import Fahrtwind.Icon.Heroicons as Heroicon
import Network.RemoteData (RemoteData(..)) as RD
import Plumage.Util.HTML as H
import React.Basic.DOM as R
import React.Basic.Emotion as E
import React.Basic.Hooks as React
import UI.Block.Card (card, clickableCard)
import UI.Component (ComponentM)
import UI.Component as UI
import UI.FilePath (renderFilePath)
import UI.Hook.UseIPCMessage (useIPCMessage)
import UI.Navigation.Router (useRouter)
import UI.Navigation.Router.Page.Preferences as Preferences
import UI.Navigation.Router.Types (Route(..))
import UI.Notification.ErrorNotification (errorNotification)
import UI.Notification.SendNotification (sendNotification)
import UI.Tool.Spago as Spago
import UI.Tooltip (withTextTooltip)
import Yoga.Block as Block
import Yoga.Block.Atom.Button.Types as Button
import Yoga.Block.Container.Style (col)
import Yoga.Block.Hook.UseStateEq (useStateEq, useStateEq')
import Yoga.Block.Organism.NotificationCentre.Notification.View (autoHideNotification)
import Yoga.Block.Organism.NotificationCentre.Types (NotificationCentre(..))
import Yoga.JSON (writeJSON) as JSON

rootView = mempty

mkView ∷ UI.Component Unit
mkView = do
  toolView ← mkToolView
  UI.component "PreferencesRoot" \ctx@{ notificationCentre } route → React.do
    toolsʔ ← useGetTools ctx
    pure $ toolsʔ # foldMap \tools → Block.stack { space: E.px 8 }
      (tools <#> toolView)
  where
  useGetTools ctx = React.do
    result /\ query /\ _reset ← useIPCMessage ctx
    toolsʔ /\ setTools ← useStateEq' Nothing
    useEffect result do
      case result of
        RD.NotAsked → query GetInstalledTools
        RD.Failure void → absurd void
        RD.Loading → mempty
        RD.Success (GetInstalledToolsResponse (UnsupportedOperatingSystem)) →
          sendNotification ctx $ errorNotification
            { title: "Error"
            , body: R.text "Your operating system is not supported."
            }
        RD.Success (GetInstalledToolsResponse (ToolsResult tools)) → do
          setTools (Just tools)
        RD.Success other →
          sendNotification ctx $ errorNotification
            { title: "BUG: Unexpected message"
            , body: R.text $ JSON.writeJSON other
            }
      mempty
    pure toolsʔ

mkToolView ∷ UI.Component (Tool /\ Maybe ToolPath)
mkToolView = do
  UI.component "Tool" \_ (tool /\ toolPathʔ) → React.do
    { navigate } ← useRouter
    let
      theCard = case tool of
        Spago → clickableCard
          (handler_ (navigate $ Preferences Preferences.Spago))
        _ → card
    pure $ theCard
      [ Block.cluster { justify: "space-between" }
          [ H.div_ (flexCol)
              [ R.code' </* { css: textLg } />
                  [ tool # Tool.toCommand # R.text ]
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
                          mempty
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