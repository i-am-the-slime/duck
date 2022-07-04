module UI.Registry where

import Yoga.Prelude.View

import Biz.GraphQL (GraphQL(..))
import Biz.Spago.Types (ProjectName(..), Repository(..))
import Data.Function.Uncurried (mkFn2)
import Data.Map (Map)
import Data.Map as Map
import Data.Newtype (un)
import Data.Tuple (Tuple)
import Fahrtwind (fontFamilyOrMono, height, textXl)
import Foreign (MultipleErrors)
import Network.RemoteData (RemoteData(..))
import Network.RemoteData as RD
import Plumage.Util.HTML as P
import React.Basic.DOM as R
import React.Basic.Emotion as E
import React.Basic.Hooks as React
import React.Virtuoso (virtuosoWithData)
import UI.Component as UI
import UI.GithubLogin.UseGithubGraphQL (useGithubGraphQL)
import Yoga.Block as Block
import Yoga.JSON (class ReadForeign)
import Yoga.JSON as JSON

mkView ∷ UI.Component Unit
mkView = do
  UI.component "Registry" \ctx _ → React.do
    result /\ sendQuery ← useGithubGraphQL ctx getFileInRepoQuery
    useEffectOnce do
      sendQuery bowerPackagesInput
      mempty
    pure
      case
        result >>= (parseJSONFile >>> RD.fromEither)
        of
        NotAsked → R.text "Now, you see me..."
        Loading → R.text "Loading..."
        Failure f → R.text $ "Failed to load  " <> show f
        Success (repos ∷ Map ProjectName Repository) →
          listRepos repos

parseJSONFile ∷
  ∀ o. ReadForeign o ⇒ FileInRepoResponse → Either MultipleErrors o
parseJSONFile x = JSON.readJSON x.data.repository.object.text

listRepos ∷ Map ProjectName Repository → JSX
listRepos repos = P.div_ (height 400) $ pure do

  virtuosoWithData </>
    { useWindowScroll: true
    , style: R.css
        { height: "100%", width: "100%" }
    , data: Map.toUnfoldable repos ∷ Array (Tuple ProjectName Repository)
    , itemContent: mkFn2 renderRepo
    }

  where
  renderRepo ∷ Int → (ProjectName /\ Repository) → JSX
  renderRepo i (name /\ repo) = Block.box_
    [ Block.stack { space: E.str "8px" }
        [ P.div_ textXl [ R.text $ un ProjectName name ]
        , P.div_ (fontFamilyOrMono "Jetbrains Mono")
            [ R.text (un Repository repo) ]
        ]
    ]

bowerPackagesInput =
  { owner: "purescript"
  , name: "registry"
  , branch_and_file: "HEAD:bower-packages.json"
  }

getFileInRepoQuery ∷ GraphQL
getFileInRepoQuery = GraphQL
  """
query RepoFiles($owner: String!, $name: String!, $branch_and_file:String!) {
  repository(owner: $owner, name: $name) {
    object(expression: $branch_and_file) {
      ... on Blob {
        text
      }
    }
  }
}"""

type FileInRepoResponse =
  { data ∷ { repository ∷ { object ∷ { text ∷ String } } } }
