module Story.TreeView (default, treeView) where

import Prelude

import Data.Maybe (Maybe(..))
import Yoga.Tree.Zipper as Loc
import Data.Tuple.Nested ((/\))
import Effect (Effect)
import Fahrtwind (heightScreen)
import Plumage.Util.HTML as P
import React.Basic (JSX)
import React.Basic.Hooks as React
import Story.Util.Decorator (containerDecorator)
import Storybook (story)
import Storybook.Types (Story)
import UI.Github.Repo.Biz.UseGetAllFiles.Types (RESTFileInfo, AllFilesAPIResult)
import UI.Repository.FileTree.View as TreeView

default ∷ Story
default = story { title: "TreeView", decorators: [ containerDecorator ] }

folder ∷
  String → RESTFileInfo
folder path =
  { path
  , size: Nothing
  , type: "tree"
  , url: "egal"
  }

file ∷
  String → RESTFileInfo
file path =
  { path
  , size: Nothing
  , type: "blob"
  , url: "egal"
  }

fakeResult ∷ AllFilesAPIResult
fakeResult =
  { tree:
      [ folder "src"
      , folder "049340950349580498530985039485093485"
      , folder "src/More"
      , folder "src/in"
      , folder "src/in/the"
      , folder "src/in/the/midnight"
      , folder "src/in/the/midnight/hour"
      , folder "src/in/the/midnight/hour/she"
      , folder "src/in/the/midnight/hour/she/cried"
      , folder "src/in/the/midnight/hour/she/cried/more"
      , folder "src/in/the/midnight/hour/she/cried/more/more"
      , folder "src/in/the/midnight/hour/she/cried/more/more/more"
      , folder "test"
      , file "src/Main.purs"
      , file "src/More/File.purs"
      , file "src/More/File2.purs"
      , file "src/More/File3.purs"
      , file "src/More/File4.purs"
      , file "src/More/File5.purs"
      , file "src/More/File6.purs"
      , file "test/Main.purs"
      , file "spago.dhall"
      , file "spago1.dhall"
      , file "spago2.dhall"
      , file "spago3.dhall"
      , file "spago4.dhall"
      , file "spago5.dhall"
      , file "spago6.dhall"
      , file "spago7.dhall"
      , file "spago8.dhall"
      , file "spago9.dhall"
      , file "spago10.dhall"
      , file "spago11.dhall"
      , file "spago12.dhall"
      , file "spago13.dhall"
      , file "spago14.dhall"
      , file "spago15.dhall"
      ]
  , truncated: false
  , url: "who-carse"
  }

treeView ∷ Effect JSX
treeView = storyCompo <@> unit

storyCompo ∷ React.Component Unit
storyCompo = do
  let filetree = TreeView.toTree fakeResult
  treeViewC ← TreeView.mkPresentationalView
  React.component "Helper" \_ → React.do
    loc /\ setLoc ← React.useState' (Loc.fromTree filetree)
    selectedʔ /\ setSelected ← React.useState'
      (Just "049340950349580498530985039485093485")
    pure $ P.div_ (heightScreen)
      [ treeViewC { loc, setLoc, selectedʔ, setSelected } ]
