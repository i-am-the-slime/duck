module UI.Github.Repo.Style where

import Yoga.Prelude.Style

container ∷ Style
container = flexRow <> heightFull

fileTreeContainer ∷ Style
fileTreeContainer =
  widthFull
    <> flexGrow 0
    <> flexShrink 0
    <> css { flexBasis: str "100%" }
    <> heightFull
