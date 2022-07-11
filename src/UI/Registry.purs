module UI.Registry where

import Prelude
import Yoga.Prelude.View

import Backend.Github.API.Types (GithubGraphQLQuery, githubGraphQLQuery)
import Biz.GraphQL (GraphQL(..))
import Biz.Spago.Types (ProjectName(..), Repository(..))
import Control.Monad.ST as ST
import Control.Monad.ST.Ref as ST
import Data.Array as Array
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NonEmptyArray
import Data.Array.ST as STArray
import Data.DateTime.Instant (Instant, durationMillis)
import Data.Foldable (foldMap, traverse_)
import Data.Function.Uncurried (mkFn2)
import Data.Int as Int
import Data.Interpolate (i)
import Data.JSDate (JSDate)
import Data.JSDate as JSDate
import Data.List as List
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (fromJust)
import Data.Newtype (un)
import Data.String (Pattern(..), split, stripPrefix, stripSuffix)
import Data.String as String
import Data.Time.Duration (Days(..), toDuration)
import Data.Traversable (traverse)
import Debug (spy)
import Effect.Aff (Milliseconds(..))
import Effect.Aff as Aff
import Effect.Class.Console as Console
import Effect.Now as DateTime
import Effect.Now as Instant
import Effect.Ref as Ref
import Effect.Unsafe (unsafePerformEffect)
import Fahrtwind (acceptClicks, background, background', borderBottom, borderCol, borderCol', cursorPointer, displayNone, flexCol, flexGrow, flexRow, focusWithin, fontBold, fontLight, fontMedium, fontSemiMedium, fontThin, full, gap, height, height', heightFull, hover, lineHeight, mX, mXAuto, mXY, maxHeight', maxWidth, overflowHidden, overflowYScroll, pX, pX', pXY, pY, pY', roundedDefault, roundedFull, roundedLg, roundedMd, roundedNone, roundedXl, screenHeight, screenLg, screenMd, screenXl, shadowLg, textCol', textDefault, textLg, textXl, textXs, transform, transition, width, width', widthAndHeight, widthFull)
import Fahrtwind.Icon.Heroicons as Heroicon
import Foreign (Foreign, MultipleErrors)
import Foreign.Object (mapWithKey)
import Image (setFallbackImgSrc)
import Network.RemoteData (RemoteData(..))
import Network.RemoteData as RD
import Partial.Unsafe (unsafePartial)
import Plumage.Hooks.UsePopOver (usePopOver)
import Plumage.Util.HTML as P
import React.Basic.DOM as R
import React.Basic.Emotion (ch)
import React.Basic.Emotion as E
import React.Basic.Hooks as React
import React.Basic.Hooks.Aff (useAff)
import React.Virtuoso (virtuosoImpl)
import Type.Function (type ($))
import UI.Block.Card (card, clickableCard, styledCard, styledClickableCard)
import UI.Component as UI
import UI.Container (modalClickawayId, modalContainerId)
import UI.Ctx.Types (Ctx)
import UI.FilePath (GithubRepo, renderFilePath, renderGithubRepo)
import UI.GithubLogin.UseGithubGraphQL (UseGithubGraphQL, useDynamicGithubGraphQL, useGithubGraphQL)
import UI.Hook.UseGetFileInRepo (GetFileInRepoInput, useGetTextFileInRepo)
import UI.MainPane.Style (mainViewHeight)
import UI.Modal (mkModalView)
import UI.Navigation.HeaderBar.GithubAvatar (duckImage, notFoundImage)
import UI.Repository.View as Repository
import Web.DOM (Element)
import Web.DOM.NonElementParentNode (getElementById)
import Web.HTML (window)
import Web.HTML.HTMLDocument (toNonElementParentNode)
import Web.HTML.Window (document)
import Yoga.Block as Block
import Yoga.Block.Atom.Input.Hook.UseTypingPlaceholders (useTypingPlaceholders)
import Yoga.Block.Container.Style (col, colour)
import Yoga.Block.Hook.UseDocumentSize (useDocumentSize)
import Yoga.Block.Hook.UseMediaQuery (useMediaQuery)
import Yoga.Block.Hook.UseStateEq (useStateEq')
import Yoga.Block.Internal.CSS (transparent)
import Yoga.Block.Layout.Sidebar.Style (SidebarSide(..))
import Yoga.Block.Molecule.Sheet as Sheet
import Yoga.JSON as JSON
import Yoga.Prelude.View as HTMLElement

mkView ∷ UI.Component Unit
mkView = do
  repoFilter ← mkRepositoryFilter # liftEffect
  repoView ← Repository.mkView
  now ← Instant.now # liftEffect
  UI.component "Registry" \ctx _ → React.do
    bowerPackagesRD /\ sendBowerPackagesQuery ← useGetPackagesFileInRepo ctx
    newPackagesRD /\ sendNewPackagesQuery ← useGetPackagesFileInRepo ctx
    reposʔ /\ setRepos ← useStateEq' Nothing
    repoInfo /\ getRepoInfo ← useGetGithubRepoInfo ctx
    filteredReposʔ /\ setFilteredRepos ← useStateEq' Nothing
    selectedRepoʔ /\ setSelectedRepo ← useStateEq' Nothing

    screenIsAtLeastMedium ← useMediaQuery "(min-width: 768px)"

    useEffectOnce $ mempty <$ do
      sendBowerPackagesQuery bowerPackagesInput
      sendNewPackagesQuery newPackagesInput

    useEffect (bowerPackagesRD /\ newPackagesRD) do
      case bowerPackagesRD, newPackagesRD of
        Success bowerRepos, Success newRepos → do
          let allRepos = bowerRepos <> newRepos
          setRepos $ Just allRepos
          setFilteredRepos $ Just allRepos
          getRepoInfo
            ( allRepos # Map.values # Array.fromFoldable # Array.mapMaybe
                parseGithubRepoLink
            )
        _, _ → mempty
      mempty

    let
      filterBar repos =
        Block.box
          { css: background' col.backgroundBright3
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

      view = case reposʔ, filteredReposʔ of
        Just repos, Just filteredRepos → fragment
          [ P.div_ (flexCol <> heightFull <> maxHeight' full)
              [ filterBar repos
              , P.div_
                  ( flexRow <> flexGrow 999 <> overflowHidden
                      <>
                        ( screenMd $
                            E.css
                              { ".virtualised-registry-entries": E.nested
                                  $ width 360 <> maxWidth 360
                              }
                        )
                      <>
                        E.css
                          { ".virtualised-registry-entries": E.nested
                              widthFull
                          }

                  )
                  [ P.div_
                      ( displayNone
                          <> screenMd
                            ( E.css { display: E.str "block" }
                                <> overflowYScroll
                                <> heightFull
                                <> maxHeight' full
                                <> width' (E.str "calc(100% - 360px)")
                            )
                      )
                      [ selectedRepoʔ # foldMap
                          ( styledCard
                              ( mXY 24
                                  <> pX' (E.var "--s2")
                                  <> pY' (E.var "--s2")
                                  <> roundedLg
                                  <>
                                    ( screenXl
                                        ( width 800 <> mXAuto
                                            <> roundedXl
                                            <> pX' (E.var "--s4")
                                            <> pY' (E.var "--s3")
                                        )
                                    )
                              )
                              <<< pure
                              <<< repoView
                          )
                      ]
                  , listRepos
                      { now, repoInfo, selectedRepoʔ, setSelectedRepo }
                      filteredRepos
                  ]
              , guard (not screenIsAtLeastMedium) $ Sheet.component
                  </>
                    { content: P.div_ (height' (E.str "66vh"))
                        [ selectedRepoʔ # foldMap repoView ]
                    , header: P.div_ (textLg) [ R.text "README.md" ]
                    , footer: mempty
                    , isOpen: selectedRepoʔ # isJust
                    , onDismiss: setSelectedRepo Nothing
                    , containerId: modalContainerId
                    , clickAwayId: modalClickawayId
                    }
              ]

          ]

        _, _ → mempty
    pure
      ( P.div_ (height' mainViewHeight <> overflowHidden)
          [ view ]
      )

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
                    getHTMLElementFromRef inputRef >>= traverse_
                      HTMLElement.focus
                }
              />
                [ if text == "" then Heroicon.search else Heroicon.x
                ]
          , onChange: handler targetValue (traverse_ setText)
          , inputRef
          -- , label: nonEmptyString @"Filter repositories"
          }
      ]

listRepos ∷
  { repoInfo ∷ Map ProjectName (RemoteData String JSDate)
  , now ∷ Instant
  , selectedRepoʔ ∷ Maybe GithubRepo
  , setSelectedRepo ∷ Maybe GithubRepo → Effect Unit
  } →
  Map ProjectName Repository →
  JSX
listRepos { repoInfo, now, selectedRepoʔ, setSelectedRepo } repos = do
  let
    withDate = repos # Map.mapMaybeWithKey
      ( \name repo →
          Just (repo /\ (Map.lookup name repoInfo))
      )
  virtuosoImpl </>
    { useWindowScroll: false
    , overscan: 300.0
    , className: "virtualised-registry-entries"
    , style: R.css { height: "100%", background: colour.backgroundLayer4 }
    , data:
        Map.toUnfoldable withDate ∷
          Array (ProjectName /\ Repository /\ Maybe (RemoteData String JSDate))
    , itemContent: mkFn2 renderRepo
    }

  where
  renderRepo ∷
    Int →
    (ProjectName /\ Repository /\ Maybe (RemoteData String JSDate)) →
    JSX
  renderRepo _i (name /\ repo /\ lastCommitʔ) = do
    let githubRepoʔ = parseGithubRepoLink repo
    let
      cardStyle = roundedNone <> borderBottom 1
        <> borderCol' col.backgroundLayer2
        <> hover (background' col.backgroundLayer3)
    let
      theCard = githubRepoʔ # maybe
        (styledCard cardStyle)
        ( styledClickableCard cardStyle <<< handler_ <<< setSelectedRepo <<<
            Just
        )
    theCard
      [ Block.cluster_
          [ githubRepoʔ # foldMap \{ owner } → R.img' </*>
              { css: roundedMd
              , className: "gh-avatar"
              , width: "48px"
              , height: "48px"
              , src: "https://github.com/" <> owner <> ".png"
              , onError: handler target (setFallbackImgSrc notFoundImage)
              }
          , Block.stack { space: E.str "0" }
              [ P.div_ (textDefault <> fontMedium <> lineHeight "1em")
                  [ R.text
                      ( un ProjectName name # \n →
                          stripPrefix
                            (Pattern "purescript-")
                            n # fromMaybe n
                      )
                  ]
              , P.span_ (textXs <> textCol' col.textPaler4)
                  [ lastCommitʔ # R.text <<< case _ of
                      Nothing → "(Only works for Github repos)"
                      Just (RD.NotAsked) → "Loading"
                      Just (RD.Loading) → "Loading"
                      Just (RD.Failure e) → String.take 24 e
                      Just (RD.Success s) → JSDate.toInstant s # foldMap
                        \start →
                          approximateHumanReadableTimeInThePast
                            { start, end: now }

                  ]
              , case githubRepoʔ of
                  Nothing → renderFilePath (un Repository repo)
                  Just githubRepo → renderGithubRepo githubRepo
              ]
          ]
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

bowerPackagesInput ∷ { | GetFileInRepoInput }
bowerPackagesInput =
  { owner: "purescript"
  , name: "registry"
  , revision_and_file: "HEAD:bower-packages.json"
  }

newPackagesInput ∷ { | GetFileInRepoInput }
newPackagesInput =
  { owner: "purescript"
  , name: "registry"
  , revision_and_file: "HEAD:new-packages.json"
  }

useGetPackagesFileInRepo ∷
  Ctx →
  Hook UseGithubGraphQL
    $ RemoteData MultipleErrors (Map ProjectName Repository)
    /\ ({ | GetFileInRepoInput } → Effect Unit)
useGetPackagesFileInRepo ctx = React.do
  rd /\ get ← useGetTextFileInRepo ctx
  pure $ (rd >>= (JSON.readJSON >>> RD.fromEither)) /\ get

type Entry =
  { name ∷ ProjectName
  , defaultBranchRef ∷
      { name ∷ String
      , target ∷
          { history ∷ { edges ∷ Array { node ∷ { pushedDate ∷ Maybe String } } }
          }
      }
  }

useGetGithubRepoInfo (ctx ∷ Ctx) = React.do
  rd /\ get ← useDynamicGithubGraphQL ctx
  remainingChunks /\ setRemainingChunks ← React.useState []
  results /\ setResults ← React.useState
    (Map.empty ∷ _ ProjectName (RemoteData String JSDate))
  resultsRef ← React.useRef
    (Map.empty ∷ _ ProjectName (RemoteData String JSDate))
  useEffect remainingChunks do
    chunkResults ← React.readRef resultsRef
    setResults (Map.union chunkResults)
    case (Array.head remainingChunks) of
      Nothing → mempty
      Just chunk → do
        setResults
          ( Map.union
              ( chunk <#> (\{ repoName } → ProjectName repoName /\ Loading)
                  # Map.fromFoldable
              )
          )
        get (mkGetRepoInfo chunk) {}
    -- [TODO] set results
    mempty

  useEffect rd do
    case rd of
      RD.NotAsked → do
        React.writeRef resultsRef Map.empty
      RD.Loading → mempty
      RD.Failure e → do
        let _ = spy "errrrrrrrrrrrrrror" e
        Console.log (show e)
        mempty
      RD.Success (repoInfoResult ∷ { | RepoInfoResult }) → do
        let _ = spy "succ" "succ"
        intermediate ← React.readRef resultsRef
        React.writeRef resultsRef
          ( intermediate # Map.union
              ( ( repoInfoResult.data # Map.values
                    # List.mapMaybe
                        ( map \x → x.name /\
                            ( x.defaultBranchRef.target.history.edges
                                # Array.head
                                >>= _.node.pushedDate
                                <#> (unsafePerformEffect <<< JSDate.parse)
                                # note "null result from API"
                                # RD.fromEither
                            )
                        )
                )
                  # Map.fromFoldable
              )
          )
        setRemainingChunks (Array.tail >>> fromMaybe [])
    mempty
  let
    result ∷
      (Map ProjectName (RemoteData String JSDate)) /\
        (Array GithubRepo → Effect Unit)
    result =
      results /\ \repos → do
        let chunks = chunked 50 repos
        setResults
          ( const
              ( Map.fromFoldable
                  ( repos <#>
                      (\{ repoName } → (ProjectName repoName /\ NotAsked))
                  )
              )
          )
        setRemainingChunks (const (chunks))

  pure result

chunked ∷ ∀ a. Int → Array a → Array (NonEmptyArray a)
chunked chunkSize arr = ST.run do
  iRef ← ST.new 0
  result ← STArray.new
  ST.while (ST.read iRef <#> (_ < Array.length arr)) do
    i ← ST.read iRef
    let chunk = Array.slice i (i + chunkSize) arr
    for_ (NonEmptyArray.fromArray chunk) (\res → STArray.push res result)
    _ ← iRef # ST.modify (_ + chunkSize)
    pure unit
  STArray.freeze result

type RepoInfoResult = (data ∷ (Map String (Maybe Entry)))

mkGetRepoInfo ∷ NonEmptyArray GithubRepo → GraphQL
mkGetRepoInfo repos = GraphQL $
  i fragment "\n{\n" inputs "\n}"
  where
  inputs ∷ String
  inputs = repos # foldMapWithIndex toRepoQuery

  toRepoQuery index { owner, repoName: repo } = do
    i "repo" index ":" "repository" "(owner:" (quote owner) ", name: "
      (quote repo)
      ") "
      "{ ...repoProperties }\n"

  fragment =
    """
    fragment repoProperties on Repository {
        name
        defaultBranchRef {
          name
          target {
            ... on Commit {
              history(first: 1) {
                edges {
                  node {
                    pushedDate
                  }
                }
              }
            }
          }
        }
      }
    """

  quote ∷ String → String
  quote = show

approximateHumanReadableTimeInThePast { start, end } = do
  let duration = durationMillis { start, end }
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