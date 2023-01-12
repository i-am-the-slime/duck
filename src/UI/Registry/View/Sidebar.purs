module UI.Registry.View.Sidebar (mkView) where

import Yoga.Prelude.View

import Biz.Github.Types (Login(..), Repository(..))
import Biz.GraphQL (GraphQL(..))
import Biz.Spago.Types (ProjectName(..))
import Data.Array as Array
import Data.DateTime.Instant (Instant, diff)
import Data.Function.Uncurried (mkFn3)
import Data.Int as Int
import Data.JSDate (JSDate)
import Data.JSDate as JSDate
import Data.Map (Map)
import Data.Map as Map
import Data.Newtype (un)
import Data.Number as Math
import Data.String (Pattern(..), split, stripPrefix, stripSuffix)
import Data.String as String
import Data.Time.Duration (Days(..), convertDuration, toDuration)
import Effect.Aff (Milliseconds(..))
import Effect.Aff as Aff
import Effect.Now as Instant
import Fahrtwind (background', borderBottom, borderCol', cursorPointer, flexCol, fontMedium, height, heightFull, hover, mB, mT, maxWidth, overflowXHidden, pR, pT, pX', pY, positionAbsolute, positionRelative, roundedDefault, roundedMd, roundedNone, textCol', textDefault, textOverflowEllipsis, textXs, transition, width, widthAndHeight, widthFull, zIndex)
import Fahrtwind as FW
import Fahrtwind.Icon.Heroicons as Heroicon
import Foreign.Object as Object
import Network.RemoteData (RemoteData)
import Network.RemoteData as RD
import React.Basic.DOM as R
import React.Basic.Emotion as E
import React.Basic.Hooks as React
import React.Basic.Hooks.Aff (useAff)
import React.Virtuoso (virtuosoImpl)
import UI.Block.Card (styledCard, styledClickableCard)
import UI.Component as UI
import UI.FilePath (GithubRepo, renderFilePath, renderGithubRepo)
import UI.Github.Repo.Biz.UseGetGithubRepoInfo (RepoInfo)
import UI.GithubLogin.UseGithubGraphQL (useGithubGraphQL)
import UI.HeaderBar.Style (headerBarHeight)
import UI.Navigation.HeaderBar.GithubAvatar (notFoundImage)
import UI.Navigation.Router (useRouter)
import UI.Navigation.Router.Page.Github as GithubPage
import UI.Navigation.Router.Types (Route)
import UI.Navigation.Router.Types as Route
import Unsafe.Reference (UnsafeRefEq(..))
import Yoga.Block as Block
import Yoga.Block.Atom.Input.Hook.UseTypingPlaceholders (useTypingPlaceholders)
import Yoga.Block.Atom.Input.Style as SizeVariant
import Yoga.Block.Container.Style (col, colour)
import Yoga.Block.Hook.UseStateEq (useStateEq')
import Yoga.Block.Quark.Skeleton.Style (skeletonBox)
import Yoga.Prelude.View as HTMLElement
import Yoga.Prelude.View as P

mkView ∷
  UI.Component
    { filteredReposʔ ∷ Maybe (Map ProjectName Repository)
    , repoInfo ∷
        Map GithubRepo
          ( RemoteData String
              { defaultBranch ∷ String
              , lastCommit ∷ JSDate
              }
          )
    , reposʔ ∷ Maybe (Map ProjectName Repository)
    , selectedRepoʔ ∷ Maybe GithubRepo
    , setFilteredRepos ∷ Maybe (Map ProjectName Repository) → Effect Unit
    , setSelectedRepo ∷ Maybe GithubRepo → Effect Unit
    }
mkView = do
  repoFilter ← mkRepositoryFilter # liftEffect
  repoList ← mkRepoList
  UI.component "Registry"
    \_
     { reposʔ
     , repoInfo
     , selectedRepoʔ
     , setSelectedRepo
     , filteredReposʔ
     , setFilteredRepos
     } →
      React.do
        let
          sidebar =
            P.div_
              ( positionAbsolute <> FW.right 0 <> FW.top headerBarHeight
                  <> FW.width 360
                  <> FW.height'
                    (E.str $ "calc(100% - " <> show headerBarHeight <> "px)")
                  <> flexCol
              )
              ( case reposʔ, filteredReposʔ of
                  Just repos, Just filteredRepos →
                    [ P.div_
                        ( heightFull <> widthFull <> positionRelative <> pT 44
                        )
                        [ P.div_
                            ( background' col.backgroundBright3 <> flexCol
                                <> pX' (E.px 8)
                                <> pR 8
                                <> maxWidth 360
                                <> height 44
                                <> positionAbsolute
                                <> FW.top 0
                                <> FW.left 0
                                <> FW.right 0
                                <> zIndex 1
                                <> pT 6
                                <> transition "all 200ms ease-out"
                                <> borderBottom 1
                                <> borderCol' col.backgroundBright4
                            )
                            [ repoFilter
                                { repositories: repos
                                , onChange: setFilteredRepos <<< Just
                                }
                            ]
                        , repoList
                            { repoInfo
                            , selectedRepoʔ
                            , setSelectedRepo
                            , repos: filteredRepos
                            }
                        ]
                    ]
                  _, _ → mempty
              )
        pure sidebar

mkRepositoryFilter ∷
  React.Component
    { repositories ∷ Map ProjectName Repository
    , onChange ∷ Map ProjectName Repository → Effect Unit
    }
mkRepositoryFilter = do
  React.component "RepositoryFilter" \props → React.do
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
      (widthFull)
      [ Block.input </>
          { value: text
          , css: widthFull <> background' col.backgroundLayer5 <> borderCol'
              col.backgroundBright6
          , sizeVariant: SizeVariant.SizeTiny
          , leading: R.div'
              </*
                { css: widthAndHeight 14 <> textCol' col.textPaler4
                    <> cursorPointer
                    <> E.css { "& > .ry-input": E.nested (pY 0) }
                }
              /> [ Heroicon.search ]
          , trailing: guard (text /= "")
              $ R.div'
              </*
                { css: widthAndHeight 14 <> textCol' col.textPaler4
                    <> cursorPointer
                    <> E.css
                      { "& > .ry-input": E.nested
                          (pY 0)
                      }
                , onClick: handler_ do
                    guard (text /= "") (setText "")
                    getHTMLElementFromRef inputRef >>= traverse_
                      HTMLElement.focus
                }
              />
                [ if text == "" then Heroicon.search else Heroicon.x
                ]
          , onChange: handler targetValue (traverse_ setText)
          , inputRef
          -- , label: nonEmptyString (Proxy :: Proxy ("Filter repositories")
          }
      ]

type ListProps =
  { repoInfo ∷ Map GithubRepo (RemoteData String RepoInfo)
  , selectedRepoʔ ∷ Maybe GithubRepo
  , setSelectedRepo ∷ Maybe GithubRepo → Effect Unit
  , repos ∷ Map ProjectName Repository
  }

mkScrollSeekPlaceholder ∷
  Effect
    ( React.ReactComponent
        { height ∷ Int, index ∷ Int, context ∷ VirtuosoContext }
    )
mkScrollSeekPlaceholder = React.reactComponent "ScrollSeekPlaceholder"
  \{ height, index, context } → React.do
    let repoʔ = Array.index context.data_ index
    pure $ repoʔ # foldMap (\repo → renderRepo false index repo context)

mkRepoList ∷ UI.Component ListProps
mkRepoList = do
  ssph ← mkScrollSeekPlaceholder # liftEffect
  now ← Instant.now # liftEffect
  githubUserImage ← mkGithubUserImage
  UI.component "RepoList" \ctx props → React.do
    { navigate } ← useRouter
    let { repos } = props
    itemContent ← React.useMemo repos \_ → mkFn3 (renderRepo true)
    data_ ∷ Array (ProjectName /\ Repository) ←
      React.useMemo (UnsafeRefEq repos) \_ → Map.toUnfoldable repos
    pure
      $ virtuosoImpl
      </>
        { useWindowScroll: false
        , overscan: 100.0
        , className: "virtualised-registry-entries"
        , style: R.css
            { height: "100%"
            , background: colour.backgroundBright3
            }
        , context:
            { props, now, navigate, data_, githubUserImage } ∷ VirtuosoContext
        , components: { "ScrollSeekPlaceholder": ssph }
        , data: data_
        , itemContent
        , scrollSeekConfiguration:
            { enter: \velocity → Math.abs velocity > 200.0
            , exit: \velocity → Math.abs velocity < 10.0
            }

        }

type VirtuosoContext =
  { props ∷ ListProps
  , navigate ∷ Route → Effect Unit
  , now ∷ Instant
  , data_ ∷ Array (ProjectName /\ Repository)
  , githubUserImage ∷ String → JSX
  }

renderRepo ∷
  Boolean →
  Int →
  (ProjectName /\ Repository) →
  VirtuosoContext →
  JSX
renderRepo renderImage _i (name /\ repo) context =
  do
    let { props: { repoInfo }, navigate, now, githubUserImage } = context
    let githubRepoʔ = parseGithubRepoLink repo
    let lastCommitRD = githubRepoʔ >>= \ghr → Map.lookup ghr repoInfo
    let
      cardStyle = roundedNone <> borderBottom 1
        <> borderCol' col.backgroundBright4
        <> hover (background' col.backgroundLayer3)
    let
      theCard = githubRepoʔ # maybe
        (styledCard cardStyle)
        ( \reposi → styledClickableCard cardStyle $ handler_
            ( navigate
                ( Route.Github
                    ( GithubPage.Repository
                        (Login reposi.owner)
                        (Repository reposi.repoName)
                    )
                )
            )
        )
    theCard
      [ Block.cluster_
          [ if renderImage then githubRepoʔ # foldMap \{ owner } →
              githubUserImage owner
            else P.div_ (widthAndHeight 48) []
          , Block.stack { space: E.str "0" }
              [ purescriptRepoName name
              , lastCommit now lastCommitRD
              , case githubRepoʔ of
                  Nothing → renderFilePath (un Repository repo)
                  Just githubRepo → renderGithubRepo githubRepo
              ]
          ]
      ]

getUserImageQuery ∷ GraphQL
getUserImageQuery = GraphQL
  """query getUserImage($login:String!){ repositoryOwner(login: $login) { avatarUrl } }"""

mkGithubUserImage ∷ UI.Component String
mkGithubUserImage = UI.component "GithubUserImage"
  \ctx owner → React.do
    { data: res, send } ∷
      { send ∷ { login ∷ String } → Effect Unit
      , data ∷ _ _
          { data ∷ { repositoryOwner ∷ { avatarUrl ∷ String } } }

      } ← useGithubGraphQL
      ctx
      (Just (convertDuration (30.0 # Days)))
      getUserImageQuery
    useEffect owner do
      send { login: owner }
      mempty
    pure $ case RD.toMaybe res of
      Just ({ data: { repositoryOwner: { avatarUrl } } }) →
        Block.image
          { css: roundedMd
          , width: 48
          , height: 48
          , src: avatarUrl
          , fallbackSrc: notFoundImage
          }
      Nothing →
        P.div_
          ( widthAndHeight 48 <> roundedMd <> background'
              col.backgroundLayer3
          )
          []

lastCommit ∷
  ∀ r.
  Instant →
  Maybe (RemoteData String { lastCommit ∷ JSDate | r }) →
  JSX
lastCommit now lastCommitRD = P.div_
  ( textXs <> textCol' col.textPaler4 <> (mB 4)
  )
  [ lastCommitRD # case _ of
      Nothing → R.text "???"
      Just (RD.NotAsked) → R.div'
        </*
          { css: (skeletonBox <> roundedDefault <> width 140)
          , _data: Object.singleton "animated" "false"
          }
        /> []
      Just (RD.Loading) → R.div'
        </*
          { css: (skeletonBox <> roundedDefault <> width 140)
          , _data: Object.singleton "animated" "true"
          }
        /> []
      Just (RD.Failure e) → R.text (String.take 24 e)
      Just (RD.Success { lastCommit }) → P.div_ (mT (-4))
        [ R.text $ JSDate.toInstant lastCommit #
            foldMap
              \start →
                approximateHumanReadableTimeInThePast
                  { start, end: now }
        ]
  ]

purescriptRepoName ∷ ProjectName → JSX
purescriptRepoName (ProjectName name) = P.div_
  ( textDefault <> fontMedium
      <> E.css { whiteSpace: E.str "nowrap" }
      <> textOverflowEllipsis
      <> overflowXHidden
      <> maxWidth 220
  )
  [ R.text (name # \n → stripPrefix (Pattern "purescript-") n # fromMaybe n)
  ]

parseGithubRepoLink ∷ Repository → Maybe GithubRepo
parseGithubRepoLink (Repository repo) = case strippedPrefix of
  Just userAndRepo
    | [ owner, re ] ← split (Pattern "/") userAndRepo → do
        let repoName = re # stripSuffix (Pattern ".git") # fromMaybe re
        Just { owner, repoName }
  _ → Nothing
  where
  strippedPrefix =
    stripPrefix (Pattern "https://github.com/") repo
      <|> stripPrefix (Pattern "git@github.com:") repo

type Entry =
  { name ∷ String
  , owner ∷ { login ∷ String }
  , defaultBranchRef ∷
      { name ∷ String
      , target ∷
          { history ∷ { edges ∷ Array { node ∷ { pushedDate ∷ Maybe String } } }
          }
      }
  }

approximateHumanReadableTimeInThePast ∷
  { end ∷ Instant, start ∷ Instant } → String
approximateHumanReadableTimeInThePast { start, end } = do
  let duration = diff end start
  let days = toDuration duration # un Days
  let hours = days * 24.0
  let minutes = hours / 60.0
  let years = days / 365.0
  let months = days / 30.0
  if (years > 1.0) then do
    let intYears = Int.round years
    if intYears == 1 then "one year ago"
    else show intYears <> " years ago"
  else if (months > 1.0) then do
    let intMonths = Int.round months
    if intMonths == 1 then "one month ago"
    else show intMonths <> " months ago"
  else if days >= 1.0 then do
    let intDays = Int.round days
    if intDays == 1 then "one day ago"
    else show intDays <> " days ago"
  else if hours >= 1.0 then do
    let intHours = Int.round hours
    if intHours == 0 then "today"
    else if intHours == 1 then "yesterday"
    else show intHours <> " days ago"
  else do
    let intMinutes = Int.round minutes
    if intMinutes == 0 then "just now"
    else if intMinutes == 1 then "a minute ago"
    else show intMinutes <> " minutes ago"
