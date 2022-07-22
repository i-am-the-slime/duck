module UI.Github.Repo.View where

import Yoga.Prelude.View

import Data.Tree (Tree)
import Data.Tree.Zipper as Loc
import Fahrtwind (background', block, heightFull, mL, positionAbsolute, positionRelative, width, widthFull)
import Network.RemoteData as RD
import Plumage.Util.HTML as P
import React.Basic.DOM as R
import React.Basic.Hooks as React
import UI.Component as UI
import UI.Editor (useMonaco)
import UI.FilePath (GithubRepo)
import UI.Github.Repo.Biz.UseGetAllFiles as Biz
import UI.Github.Repo.Style as Style
import UI.Hook.UseGetFileInRepo (useGetTextFileInRepo)
import UI.Repository.FileTree.View (RESTFileInfo)
import UI.Repository.FileTree.View as FileTree
import UI.Repository.FileTree.View as Tree
import Yoga.Block.Container.Style (col)

type Props = { repo ∷ GithubRepo }

mkView ∷ UI.Component Props
mkView = do
  view ← mkPresentationalView # liftEffect
  fileEditor ← mkFileEditor
  UI.component "GithubRepo" \_ props → React.do
    selectedʔ /\ setSelected ← React.useState' Nothing
    allFiles ← Biz.useGetAllFiles
    React.useEffect props.repo do
      allFiles.load props.repo
      mempty
    let treeʔ = RD.toMaybe allFiles.data
    pure $ P.div_ (positionRelative <> widthFull <> heightFull)
      [ treeʔ # foldMap \tree → P.div_
          ( positionAbsolute <> heightFull <> width 260
          )
          [ view { tree, selectedʔ, setSelected }
          ]
      , P.div_
          ( heightFull
              <> mL 260
              <> background' col.highlightRotatedForwards
              <> block
          ) $ fold ado
          filePath ← selectedʔ
          let onChange = mempty
          in
            [ fileEditor
                { filePath, githubRepo: props.repo, onChange }
            ]
      ]

type PresentationalProps =
  { selectedʔ ∷ Maybe String
  , setSelected ∷ (Maybe String → Effect Unit)
  , tree ∷ Tree RESTFileInfo
  }

mkPresentationalView ∷ React.Component PresentationalProps
mkPresentationalView = do
  fileTreeC ← FileTree.mkPresentationalView
  React.component "GithubRepoPresentational" \(props ∷ PresentationalProps) →
    React.do
      loc /\ setLoc ← React.useState' (Loc.fromTree props.tree)
      useEffect props.tree do
        let newLoc = Loc.fromTree props.tree
        unless (loc == newLoc) (setLoc newLoc)
        mempty
      let {} = props
      pure $ container
        [ treeContainer
            [ fileTreeC
                ( { setSelected: props.setSelected
                  , selectedʔ: props.selectedʔ
                  , setLoc: setLoc
                  , loc
                  } ∷ Tree.PresentationalProps
                )
            ]
        ]

  where
  container ∷ Array JSX → JSX
  container = P.div "duck-repo-container" Style.container

  treeContainer ∷ Array JSX → JSX
  treeContainer = P.div "duck-tree-container" Style.fileTreeContainer

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

type FileEditorProps =
  { githubRepo ∷ GithubRepo
  , filePath ∷ String
  , onChange ∷ { originalContent ∷ String, content ∷ String } → Effect Unit
  }
