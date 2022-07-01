module Story.Preferences (default, preferences) where

import Prelude

import Biz.IPC.Message.Types (MainToRendererChannel(..), MessageToRenderer(..), RendererToMainChannel(..))
import Biz.PureScriptSolutionDefinition.Types (EntryPointType(..), PureScriptProjectDefinition(..), PureScriptSolutionDefinition)
import Data.Maybe (Maybe(..))
import Data.Tuple.Nested ((/\))
import Effect (Effect)
import React.Basic (JSX)
import Story.Ctx (OnMessage, mkStoryCtx)
import Story.Util.Decorator (containerDecorator)
import Storybook (story)
import Storybook.Types (Story)
import UI.Component (runComponent)
import UI.Preferences as Preferences
import Yoga.JSON as JSON

default ∷ Story
default = story { title: "Preferences", decorators: [ containerDecorator ] }

exampleOnMessage ∷ OnMessage
exampleOnMessage channel fgn = do
  case channel, fgn of
    GetPureScriptSolutionDefinitionsChannel, _ → do
      pure $ Just $
        GetPureScriptSolutionDefinitionsResponseChannel /\ JSON.write
          ( GetPureScriptSolutionDefinitionsResponse
              [ "/Users/mark/code/spago-viz" /\ exampleProject ]
          )
    _, _ → pure Nothing

preferences ∷ Effect JSX
preferences = do
  storyCtx ← mkStoryCtx exampleOnMessage
  runComponent storyCtx
    ( Preferences.mkView <@> unit
    )

exampleProject ∷ PureScriptSolutionDefinition
exampleProject =
  { name: "some-project"
  , projects:
      [ ( SpagoApp
            { entrypoints:
                [ { type: Test
                  , build_command: Nothing
                  , spago_file: "spago.dhall"
                  }
                ]
            , root: "."
            }
        )
      ]
  }