module UI.Github.Repo.View where

import Yoga.Prelude.View

import Data.Tree (Tree)
import Data.Tree.Zipper as Loc
import Network.RemoteData as RD
import Plumage.Util.HTML as P
import React.Basic.Hooks as React
import UI.FilePath (GithubRepo)
import UI.Github.Repo.Biz.UseGetAllFiles as Biz
import UI.Github.Repo.Style as Style
import UI.Repository.FileTree.View (RESTFileInfo)
import UI.Repository.FileTree.View as FileTree
import UI.Repository.FileTree.View as Tree

type Props = { repo ∷ GithubRepo }

mkView ∷ React.Component Props
mkView = do
  view ← mkPresentationalView
  React.component "GithubRepo" \props → React.do
    selectedʔ /\ setSelected ← React.useState' Nothing
    allFiles ← Biz.useGetAllFiles
    React.useEffect props.repo do
      allFiles.load props.repo
      mempty
    let treeʔ = RD.toMaybe allFiles.data
    pure $
      ( treeʔ # foldMap \tree → view
          { tree, selectedʔ, setSelected }
      )

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
