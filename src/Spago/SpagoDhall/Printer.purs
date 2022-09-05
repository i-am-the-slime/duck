module Spago.SpagoDhall.Printer where

import Prelude

import Data.Newtype (un)
import Dhall.Types (Glob(..), LocalImport(..))
import Dodo (Doc, break, flexGroup, foldWithSeparator, indent, spaceBreak, text)
import Dodo.Ansi (GraphicsParam)
import Dodo.Common (leadingComma, pursSquares)
import Spago.SpagoDhall.Types (DependencyName(..), SpagoDhall)

spagoDhallDoc ∷ SpagoDhall → Doc GraphicsParam
spagoDhallDoc sd =
  text ("{-" <> sd.leadingComment <> "-}")
    <> (flexGroup (text "\n{ name =" <> indent (spaceBreak <> text name)))
    <> break
    <>
      ( flexGroup
          ( text (", dependencies =") <> flexGroup
              (indent (spaceBreak <> flexGroup dependencies))
          )
      )
    <> break
    <>
      ( flexGroup
          (text ", packages =" <> indent (spaceBreak <> text packages))
      )
    <> (flexGroup (text "\n, sources =" <> indent (spaceBreak <> sources)))
    <> text "\n}\n"
  where
  quote = show
  name = quote sd.name
  dependencies =
    pursSquares $ foldWithSeparator leadingComma $
      un DependencyName >>> quote >>> text <$> sd.dependencies
  packages = un LocalImport sd.packages
  sources = pursSquares $ foldWithSeparator leadingComma $
    un Glob >>> quote >>> text <$> sd.sources
