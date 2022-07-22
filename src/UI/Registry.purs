module UI.Registry (mkView) where

import Yoga.Prelude.View

import Biz.Github.Types (Repository(..))
import Biz.Spago.Types (ProjectName)
import Data.Array as Array
import Data.Map (Map)
import Data.Map as Map
import Data.String (Pattern(..), split, stripPrefix, stripSuffix)
import Data.String as String
import Fahrtwind (displayNone, flexCol, flexGrow, flexRow, full, height', heightFull, mXAuto, maxHeight', maxWidth, minHeight', overflowHidden, pX', pY', roundedNone, roundedXl, screenMd, screenXl, textLg, width, width', widthFull)
import Foreign (MultipleErrors)
import Network.RemoteData (RemoteData(..))
import Network.RemoteData as RD
import Plumage.Util.HTML as P
import React.Basic.DOM as R
import React.Basic.Emotion as E
import React.Basic.Hooks as React
import Type.Function (type ($))
import UI.Block.Card (styledCard)
import UI.Component as UI
import UI.Container (modalClickawayId, modalContainerId)
import UI.Ctx.Types (Ctx)
import UI.Editor (useMonaco)
import UI.FilePath (GithubRepo)
import UI.Github.Repo.Biz.UseGetGithubRepoInfo (RepoInfo, useGetGithubRepoInfo)
import UI.GithubLogin.UseGithubGraphQL (UseGithubGraphQL)
import UI.Hook.UseGetFileInRepo (GetFileInRepoInput, useGetTextFileInRepo)
import UI.MainPane.Style (mainViewHeight)
import UI.Registry.View.Sidebar as RegistrySidebar
import UI.Repository.FileTree.View as FileTree
import UI.Repository.View as Repository
import Yoga.Block as Block
import Yoga.Block.Hook.UseMediaQuery (useMediaQuery)
import Yoga.Block.Hook.UseStateEq (useStateEq')
import Yoga.Block.Molecule.Sheet as Sheet
import Yoga.JSON as JSON

mkView ∷ UI.Component Unit
mkView = do
  repoView ← Repository.mkView
  fileTree ← FileTree.mkView
  sidebar ← RegistrySidebar.mkView
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
                      { reposʔ
                      , filteredReposʔ
                      , setSelectedRepo
                      , selectedRepoʔ
                      , setFilteredRepos
                      , repoInfo
                      }
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

type ListProps =
  { repoInfo ∷ Map GithubRepo (RemoteData String RepoInfo)
  , selectedRepoʔ ∷ Maybe GithubRepo
  , setSelectedRepo ∷ Maybe GithubRepo → Effect Unit
  , repos ∷ Map ProjectName Repository
  }

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
  Hook (UseGithubGraphQL GetFileInRepoInput)
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
