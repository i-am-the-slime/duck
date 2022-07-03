module UI.Registry where

import Yoga.Prelude.View

import Backend.Github.API.Types (GithubGraphQLQuery, GithubGraphQLResponse(..), githubGraphQLQuery)
import Biz.GraphQL (GraphQL(..), graphQLQuery)
import Biz.IPC.Message.Types (MainToRendererChannel(..), MessageToMain(..), MessageToRenderer(..), RendererToMainChannel(..))
import Biz.Spago.Types (ProjectName(..), Repository(..))
import Data.Function.Uncurried (mkFn2)
import Data.Map (Map)
import Data.Map as Map
import Data.Newtype (un)
import Data.Tuple (Tuple)
import Fahrtwind (fontFamilyOrMono, height, textXl)
import Network.RemoteData (RemoteData(..), isNotAsked)
import Plumage.Util.HTML as P
import React.Basic.DOM as R
import React.Basic.Emotion as E
import React.Basic.Hooks as React
import React.Virtuoso (virtuosoWithData)
import UI.Component as UI
import UI.GithubLogin.UseGithubToken (useGithubToken)
import UI.Hook.UseIPCMessage (useIPCMessage)
import Yoga.Block as Block
import Yoga.JSON (readJSON_)

mkView ∷ UI.Component Unit
mkView = do
  UI.component "Registry" \ctx _ → React.do
    accessTokenʔ /\ _ ← useGithubToken
    sendMessage /\ queryResultRD ← useIPCMessage ctx QueryGithubGraphQLChannel
      GithubGraphQLResultChannel
    useEffect accessTokenʔ do
      when (queryResultRD # isNotAsked) do
        for_ accessTokenʔ \token → sendMessage
          (QueryGithubGraphQL { token, query })
      mempty
    pure case accessTokenʔ of
      Nothing → R.text "You must login to Github to use this feature"
      Just _ → case queryResultRD of
        NotAsked → R.text "Now, you see me..."
        Loading → R.text "Loading..."
        Failure _ → R.text "Failed to load"
        Success (GithubGraphQLResult (GithubGraphQLResponse res)) →
          foldMap listRepos do
            fileInRepo ∷ FileInRepoResponse ← readJSON_ res
            readJSON_ fileInRepo.data.repository.object.text
        Success _ → R.text "Wrong message.."

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

query ∷ GithubGraphQLQuery
query = githubGraphQLQuery $ graphQLQuery
  getFileInRepoQuery
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
