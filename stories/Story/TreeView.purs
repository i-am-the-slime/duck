module Story.TreeView (default, treeView) where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Tree.Zipper as Loc
import Data.Tuple.Nested ((/\))
import Effect (Effect)
import Fahrtwind (heightFull, heightScreen)
import Plumage.Util.HTML as P
import React.Basic (JSX)
import React.Basic.DOM as R
import React.Basic.Hooks as React
import Story.Util.Decorator (containerDecorator)
import Storybook (story)
import Storybook.Types (Story)
import UI.Navigation.HeaderBar as HeaderBar
import UI.Navigation.Router.Types (Route(..))
import UI.Repository.FileTree.View as TreeView

default ∷ Story
default = story { title: "TreeView", decorators: [ containerDecorator ] }

folder path =
  { path
  , size: Nothing
  , type: "tree"
  , url: "egal"
  }

file path =
  { path
  , size: Nothing
  , type: "blob"
  , url: "egal"
  }

fakeResult =
  { tree:
      [ folder "src"
      , folder "src/More"
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
    pure $ P.div_ (heightScreen)
      [ treeViewC { loc, setLoc, selectedʔ: Nothing, setSelected: mempty } ]