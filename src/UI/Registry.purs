module UI.Registry where

import Yoga.Prelude.View

import Biz.Github.Types (Owner(..), Repository(..))
import Biz.Spago.Types (ProjectName(..))
import Data.Array as Array
import Data.DateTime.Instant (Instant, durationMillis)
import Data.Function.Uncurried (mkFn3)
import Data.Int as Int
import Data.JSDate as JSDate
import Data.Map (Map)
import Data.Map as Map
import Data.Newtype (un)
import Data.String (Pattern(..), split, stripPrefix, stripSuffix)
import Data.String as String
import Data.Time.Duration (Days(..), toDuration)
import Effect.Aff (Milliseconds(..))
import Effect.Aff as Aff
import Effect.Now as Instant
import Fahrtwind (background', borderBottom, borderCol', cursorPointer, displayNone, flexCol, flexGrow, flexRow, fontMedium, full, height, height', heightFull, hover, mB, mT, mXAuto, maxHeight', maxWidth, minHeight', overflowHidden, overflowXHidden, pR, pT, pX', pY, pY', positionAbsolute, positionRelative, roundedDefault, roundedMd, roundedNone, roundedXl, screenMd, screenXl, textCol', textDefault, textLg, textOverflowEllipsis, textXs, transition, width, width', widthAndHeight, widthFull, zIndex)
import Fahrtwind as FW
import Fahrtwind.Icon.Heroicons as Heroicon
import Foreign (MultipleErrors)
import Foreign.Object as Object
import Network.RemoteData (RemoteData(..))
import Network.RemoteData as RD
import Plumage.Util.HTML as P
import React.Basic.DOM as R
import React.Basic.Emotion as E
import React.Basic.Hooks as React
import React.Basic.Hooks.Aff (useAff)
import React.Virtuoso (virtuosoImpl)
import Type.Function (type ($))
import UI.Block.Card (styledCard, styledClickableCard)
import UI.Component as UI
import UI.Container (modalClickawayId, modalContainerId)
import UI.Ctx.Types (Ctx)
import UI.Editor (useMonaco)
import UI.FilePath (GithubRepo, renderFilePath, renderGithubRepo)
import UI.Github.Repo.Biz.UseGetGithubRepoInfo (RepoInfo, useGetGithubRepoInfo)
import UI.GithubLogin.UseGithubGraphQL (UseGithubGraphQL)
import UI.HeaderBar.Style (headerBarHeight)
import UI.Hook.UseGetFileInRepo (GetFileInRepoInput, useGetTextFileInRepo)
import UI.MainPane.Style (mainViewHeight)
import UI.Navigation.HeaderBar.GithubAvatar (notFoundImage)
import UI.Navigation.Router (useRouter)
import UI.Navigation.Router.Page.Github as GithubPage
import UI.Navigation.Router.Types (Route)
import UI.Navigation.Router.Types as Route
import UI.Repository.FileTree.View as FileTree
import UI.Repository.View as Repository
import Yoga.Block as Block
import Yoga.Block.Atom.Input.Hook.UseTypingPlaceholders (useTypingPlaceholders)
import Yoga.Block.Atom.Input.Style as SizeVariant
import Yoga.Block.Container.Style (col, colour)
import Yoga.Block.Hook.UseMediaQuery (useMediaQuery)
import Yoga.Block.Hook.UseStateEq (useStateEq')
import Yoga.Block.Molecule.Sheet as Sheet
import Yoga.Block.Quark.Skeleton.Style (skeletonBox)
import Yoga.JSON as JSON
import Yoga.Prelude.View as HTMLElement

mkView ∷ UI.Component Unit
mkView = do
  repoFilter ← mkRepositoryFilter # liftEffect
  repoView ← Repository.mkView
  fileTree ← FileTree.mkView
  repoList ← mkRepoList # liftEffect
  fileEditor ← mkFileEditor
  UI.component "Registry" \ctx _ → React.do
    bowerPackagesRD /\ sendBowerPackagesQuery ← useGetPackagesFileInRepo ctx
    newPackagesRD /\ sendNewPackagesQuery ← useGetPackagesFileInRepo ctx
    reposʔ /\ setRepos ← useStateEq' Nothing
    repoInfo /\ getRepoInfo ← useGetGithubRepoInfo ctx
    filteredReposʔ /\ setFilteredRepos ← useStateEq' Nothing
    selectedRepoʔ /\ setSelectedRepo ← useStateEq' Nothing
    selectedFileʔ /\ setSelectedFile ← useStateEq' Nothing

    screenIsAtLeastMedium ← useMediaQuery "(min-width: 768px)"

    useEffectOnce $ mempty <$ do
      sendBowerPackagesQuery bowerPackagesInput
      sendNewPackagesQuery newPackagesInput

    useEffect (bowerPackagesRD /\ newPackagesRD) do
      case bowerPackagesRD, newPackagesRD of
        Success bowerRepos, Success newRepos → do
          let
            allRepos = (Map.union bowerRepos newRepos) # Map.filter
              \(Repository r) →
                deadRepos # not Array.any
                  \repo → r # String.contains (Pattern repo)

          setRepos $ Just allRepos
          setFilteredRepos $ Just allRepos
          getRepoInfo
            ( allRepos # Map.mapMaybe parseGithubRepoLink # Map.values #
                Array.fromFoldable
            )
        _, _ → mempty
      mempty

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

      view = case reposʔ, filteredReposʔ of
        Just _repos, Just _filteredRepos → fragment
          [ P.div_ (flexCol <> heightFull <> maxHeight' full)
              [ P.div_
                  ( flexRow <> flexGrow 999 <> overflowHidden
                      <>
                        ( screenMd $
                            E.css
                              { ".virtualised-registry-entries":
                                  E.nested $ width 360 <> maxWidth 360
                                    <> E.css { flex: E.str "0 0 360px" }
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
                          <> heightFull
                          <> screenMd
                            ( E.css { display: E.str "block" }
                                <> E.css { overflowY: E.str "overlay" }
                                <> heightFull
                                <> minHeight' full
                                <> maxHeight' full
                                <> width' (E.str "calc(100% - 360px)")
                            )
                      )
                      [ selectedRepoʔ # foldMap \repo →
                          P.div_ (flexRow <> heightFull)
                            [ P.div_
                                ( width 200
                                    <> E.css { flex: E.str "0 0 200px" }
                                )
                                [ fileTree
                                    { repo
                                    , defaultBranch:
                                        ( repoInfo # Map.lookup repo >>=
                                            RD.toMaybe
                                        ) # maybe "master" _.defaultBranch
                                    , setSelectedFile
                                    , selectedFileʔ
                                    }
                                ]
                            , Block.box { css: widthFull <> heightFull }
                                [ styledCard
                                    ( pX' (E.var "--s2")
                                        <> pY' (E.var "--s2")
                                        <> heightFull
                                        <> roundedNone
                                        <>
                                          ( screenXl
                                              ( width 800 <> mXAuto
                                                  <> roundedXl
                                                  <> pX' (E.var "--s4")
                                                  <> pY' (E.var "--s3")
                                              )
                                          )
                                    )
                                    [ fold ado
                                        githubRepo ← selectedRepoʔ
                                        filePath ← selectedFileʔ
                                        let
                                          onChange = \_x → do
                                            pure unit
                                        in
                                          fileEditor
                                            { filePath, githubRepo, onChange }
                                    ]
                                ]
                            ]
                      ]
                  , sidebar
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
          -- , label: nonEmptyString @"Filter repositories"
          }
      ]

type ListProps =
  { repoInfo ∷ Map GithubRepo (RemoteData String RepoInfo)
  , selectedRepoʔ ∷ Maybe GithubRepo
  , setSelectedRepo ∷ Maybe GithubRepo → Effect Unit
  , repos ∷ Map ProjectName Repository
  }

mkRepoList ∷ React.Component ListProps
mkRepoList = do
  now ← Instant.now
  React.component "RepoList" \props → React.do
    { navigate } ← useRouter
    let { repos } = props
    itemContent ← React.useMemo repos \_ → mkFn3 renderRepo
    pure
      $ virtuosoImpl
      </>
        { useWindowScroll: false
        , overscan: 100.0
        , className: "virtualised-registry-entries"
        , style: R.css
            { height: "100%"
            , background: colour.backgroundLayer4
            }
        , context: { props, now, navigate }
        , data: Map.toUnfoldable repos ∷ Array (ProjectName /\ Repository)
        , itemContent
        }

  where
  renderRepo ∷
    Int →
    (ProjectName /\ Repository) →
    { props ∷ ListProps, navigate ∷ Route → Effect Unit, now ∷ Instant } →
    JSX
  renderRepo _i (name /\ repo) context =
    do
      let { props: { repoInfo }, navigate, now } = context
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
                          (Owner reposi.owner)
                          (Repository reposi.repoName)
                      )
                  )
              )
          )
      theCard
        [ Block.cluster_
            [ githubRepoʔ # foldMap \{ owner } → Block.image
                { css: roundedMd
                , width: 48
                , height: 48
                , src: "https://github.com/" <> owner <> ".png"
                , fallbackSrc: notFoundImage
                }
            , Block.stack { space: E.str "0" }
                [ P.div_
                    ( textDefault <> fontMedium
                        <> E.css { whiteSpace: E.str "nowrap" }
                        <> textOverflowEllipsis
                        <> overflowXHidden
                        <> maxWidth 220
                    )
                    [ R.text
                        ( un ProjectName name # \n →
                            stripPrefix
                              (Pattern "purescript-")
                              n # fromMaybe n
                        )
                    ]
                , P.div_
                    ( textXs <> textCol' col.textPaler4 <> (mB 4)
                    )
                    [ lastCommitRD # case _ of
                        Nothing → R.text "???"
                        Just (RD.NotAsked) → R.div'
                          </*
                            { css: (skeletonBox <> roundedDefault <> width 140)
                            , _data: Object.singleton "animated" "true"
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

type FileEditorProps =
  { githubRepo ∷ GithubRepo
  , filePath ∷ String
  , onChange ∷ { originalContent ∷ String, content ∷ String } → Effect Unit
  }

mkFileEditor ∷
  UI.Component
    { filePath ∷ String
    , githubRepo ∷ GithubRepo
    , onChange ∷ { content ∷ String, originalContent ∷ String } → Effect Unit
    }
mkFileEditor = do
  UI.component "FileEditor"
    \ctx ({ githubRepo, filePath, onChange } ∷ FileEditorProps) → React.do
      fileContentRD /\ loadFile ← useGetTextFileInRepo ctx
      { ref, setValue } ← useMonaco ""
        \s → for_ fileContentRD \originalContent →
          onChange { originalContent, content: s }
      useEffect (githubRepo /\ filePath) do
        loadFile
          { revision_and_file: "HEAD:" <> filePath
          , name: githubRepo.repoName
          , owner: githubRepo.owner
          }
        mempty
      useEffect fileContentRD do
        for_ fileContentRD \fileContent → do
          setValue fileContent
        mempty
      div ← React.useMemo unit \_ → R.div'
        </*>
          { className: "duck-file-editor"
          , css: widthFull <> heightFull
          , ref
          }
      pure div

deadRepos ∷ Array String
deadRepos =
  [ "purescript/purescript-arb-instances"
  , "athanclark/purescript-big-integer"
  , "michael-swan/purescript-chosen"
  , "michael-swan/purescript-chosen-halogen"
  , "awkure/purescript-combinators"
  , "raduom/purescript-constraint-kanren"
  , "alexknvl/purescript-datareify"
  , "raduom/purescript-dynamic"
  , "KolesnichenkoDS/purescript-flux-store"
  , "mbid/purescript-focus-ui"
  , "garyb/purescript-fussy"
  , "nsaunders/purescript-globals-safe"
  , "paf31/purescript-hashable"
  , "mcoffin/purescript-hubot"
  , "piq9117/purescript-mailgun"
  , "askasp/purescript-mdcss"
  , "purescript/purescript-node-args"
  , "i-am-tom/purescript-node-readline-question"
  , "plippe/purescript-nunjucks"
  , "birdgg/purescript-org"
  , "cxfreeio/purescript-phantomjs"
  , "slamdata/purescript-photons"
  , "piq9117/purescript-plaid-node"
  , "fehrenbach/purescript-pouchdb-ffi"
  , "alvart/purescript-pux-router"
  , "purescript/purescript-reactive"
  , "purescript/purescript-reactive-jquery"
  , "saksdirect/purescript-slack"
  , "alexknvl/purescript-stablename"
  , "rightfold/purescript-stm"
  , "rightfold/purescript-subtype"
  , "dbushenko/purescript-toastr"
  , "f-o-a-m/purescript-uport"
  , "CapillarySoftware/purescript-yaml"
  ]