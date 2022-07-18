module UI.Github.Repo.Style where

import Yoga.Prelude.Style
import Fahrtwind

container ∷ Style
container = flexRow <> heightFull

fileTreeContainer ∷ Style
fileTreeContainer =
  width 200
    <> flexGrow 0
    <> flexShrink 0
    <> css { flexBasis: str "0" }
    <> heightFull