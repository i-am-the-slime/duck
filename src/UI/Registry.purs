module UI.Registry where

import Yoga.Prelude.View

import Biz.GraphQL (GraphQL(..))
import Biz.Spago.Types (ProjectName(..), Repository(..))
import Data.Function.Uncurried (mkFn2)
import Data.Map (Map)
import Data.Map as Map
import Data.Newtype (un)
import Data.String (Pattern(..), split, stripPrefix, stripSuffix)
import Data.String as String
import Data.String.NonEmpty (class MakeNonEmpty, nes)
import Data.String.NonEmpty.Internal (NonEmptyString)
import Effect.Aff (Milliseconds(..))
import Effect.Aff as Aff
import Fahrtwind (background, background', border, borderBottom, borderCol', cursorHelp, cursorPointer, flexCol, flexGrow, flexRow, focusWithin, full, green, height, heightFull, heightScreen, mT, minHeight', pB, pT, pX, shadowLg, shadowXl, shadowXxl, textCol', textXl, textXs, transition, width, widthAndHeight, widthFull)
import Fahrtwind as F
import Fahrtwind.Icon.Heroicons as Heroicon
import Foreign (MultipleErrors)
import Network.RemoteData (RemoteData(..))
import Network.RemoteData as RD
import Plumage.Util.HTML as P
import React.Basic.DOM as R
import React.Basic.Emotion as E
import React.Basic.Hooks as React
import React.Basic.Hooks.Aff (useAff)
import React.Virtuoso (virtuosoImpl)
import Type.Proxy (Proxy(..))
import UI.Block.Card (card)
import UI.Component (Ctx)
import UI.Component as UI
import UI.FilePath (GithubRepo, renderFilePath, renderGithubRepo)
import UI.GithubLogin.UseGithubGraphQL (UseGithubGraphQL, useGithubGraphQL)
import Yoga.Block as Block
import Yoga.Block.Atom.Input.Hook.UseTypingPlaceholders (useTypingPlaceholders)
import Yoga.Block.Atom.Input.Types (HTMLInputType(..))
import Yoga.Block.Container.Style (col, colour)
import Yoga.Block.Hook.UseStateEq (useStateEq')
import Yoga.JSON (class ReadForeign)
import Yoga.JSON as JSON
import Yoga.Prelude.View as HTMLElement

mkView ∷ UI.Component Unit
mkView = do
  repoFilter ← mkRepositoryFilter # liftEffect
  UI.component "Registry" \ctx _ → React.do
    bowerPackagesRD /\ sendBowerPackagesQuery ← useGetFileInRepo ctx
    newPackagesRD /\ sendNewPackagesQuery ← useGetFileInRepo ctx
    reposʔ /\ setRepos ← useStateEq' Nothing
    filteredReposʔ /\ setFilteredRepos ← useStateEq' Nothing
    useEffectOnce $ mempty <$ do
      sendBowerPackagesQuery bowerPackagesInput
      sendNewPackagesQuery newPackagesInput
    useEffect (bowerPackagesRD /\ newPackagesRD) do
      case bowerPackagesRD, newPackagesRD of
        Success bowerRepos, Success newRepos → do
          setRepos $ Just (bowerRepos <> newRepos)
          setFilteredRepos $ Just (bowerRepos <> newRepos)
        _, _ → mempty
      mempty

    let
      view = case reposʔ, filteredReposʔ of
        Just repos, Just filteredRepos →
          P.div_ (flexCol <> heightFull)
            [ Block.box
                { css: background' col.backgroundBright3 <> shadowLg
                    <> borderCol' col.backgroundBright5
                    <> borderBottom 1
                }
                [ Block.cluster { justify: "flex-end" }
                    [ repoFilter
                        { repositories: repos
                        , onChange: setFilteredRepos <<< Just
                        }
                    ]
                ]
            , P.div_ (flexGrow 9999) [ listRepos filteredRepos ]
            ]

        _, _ → mempty
    pure view

mkRepositoryFilter ∷
  React.Component
    { repositories ∷ Map ProjectName Repository
    , onChange ∷ Map ProjectName Repository → Effect Unit
    }
mkRepositoryFilter = React.component "RepositoryFilter" \props → React.do
  text /\ setText ← useStateEq' ""
  useAff text do
    Aff.delay (200.0 # Milliseconds)
    let
      pattern = Pattern (String.toLower text)
      filter = Map.filterWithKey \(ProjectName pn) (Repository repo) →
        (String.toLower pn # String.contains pattern) ||
          (String.toLower repo # String.contains pattern)
    props.onChange (filter props.repositories) # liftEffect
  inputRef ← useTypingPlaceholders "Filter for a repository name..."
    [ "for example"
    , "yoga-blocks"
    , "Or find libraries by an organisation..."
    , "like rowtype-yoga"
    ]

  pure $ P.div_
    (width 120 <> transition "all 200ms ease-out" <> focusWithin (width 300))
    [ Block.input </>
        { value: text
        , css: widthFull
        , trailing: R.div'
            </*
              { css: widthAndHeight 18 <> textCol' col.textPaler4 <>
                  cursorPointer
              , onClick: handler_ do
                  guard (text /= "") (setText "")
                  getHTMLElementFromRef inputRef >>= traverse_ HTMLElement.focus

              }
            />
              [ if text == "" then Heroicon.search else Heroicon.x
              ]
        , onChange: handler targetValue (traverse_ setText)
        , inputRef
        -- , label: nonEmptyString @"Filter repositories"
        }
    ]

useGetFileInRepo ∷
  ∀ hooks.
  Ctx →
  Render hooks (UseGithubGraphQL hooks)
    ( (RemoteData MultipleErrors (Map ProjectName Repository)) /\
        ( { | GetFileInRepoInput } →
          Effect Unit
        )
    )
useGetFileInRepo ctx = React.do
  rd /\ query ← useGithubGraphQL ctx getFileInRepoQuery
  pure ((rd >>= (parseJSONFile >>> RD.fromEither)) /\ query)

parseJSONFile ∷
  ∀ o. ReadForeign o ⇒ { | FileInRepoResponse } → Either MultipleErrors o
parseJSONFile x = JSON.readJSON x.data.repository.object.text

listRepos ∷ Map ProjectName Repository → JSX
listRepos repos = do
  virtuosoImpl </>
    { useWindowScroll: false
    , overscan: 300.0
    , className: "virtualised-registry-entries"
    , style: R.css { width: "100%", height: "100%" }
    , data: Map.toUnfoldable repos ∷ Array (ProjectName /\ Repository)
    , itemContent: mkFn2 renderRepo
    }

  where
  renderRepo ∷ Int → (ProjectName /\ Repository) → JSX
  renderRepo i (name /\ repo) = Block.box { padding: E.str "12px 16px" }
    [ card
        [ Block.stack { space: E.str "8px" }
            [ P.div_ textXl [ R.text $ un ProjectName name ]
            , case parseGithubRepoLink repo of
                Nothing → renderFilePath (un Repository repo)
                Just githubRepo → renderGithubRepo githubRepo
            ]
        ]
    ]

  parseGithubRepoLink ∷ Repository → Maybe GithubRepo
  parseGithubRepoLink r@(Repository repo) = case strippedPrefix of
    Just userAndRepo
      | [ userOrOrg, repoWithGit ] ← split (Pattern "/") userAndRepo
      , Just repoName ← repoWithGit # stripSuffix (Pattern ".git") →
          Just { userOrOrg, repoName }
    _ → Nothing
    where
    strippedPrefix =
      stripPrefix (Pattern "https://github.com/") repo
        <|> stripPrefix (Pattern "git@github.com:") repo

bowerPackagesInput ∷ { | GetFileInRepoInput }
bowerPackagesInput =
  { owner: "purescript"
  , name: "registry"
  , branch_and_file: "HEAD:bower-packages.json"
  }

newPackagesInput ∷ { | GetFileInRepoInput }
newPackagesInput =
  { owner: "purescript"
  , name: "registry"
  , branch_and_file: "HEAD:new-packages.json"
  }

type GetFileInRepoInput =
  ( branch_and_file ∷ String
  , name ∷ String
  , owner ∷ String
  )

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
  (data ∷ { repository ∷ { object ∷ { text ∷ String } } })
