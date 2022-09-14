module Spago.SpagoDhall.Printer where

import Prelude

import Biz.Spago.Types (ProjectName(..), SourceGlob(..))
import Data.Foldable (foldMap)
import Data.Newtype (un)
import Dhall.Types (LocalImport(..))
import Dodo (Doc, break, flexGroup, foldWithSeparator, indent, spaceBreak, text)
import Dodo.Ansi (GraphicsParam)
import Dodo.Common (leadingComma, pursSquares)
import Spago.SpagoDhall.Types (SpagoDhall)

spagoDhallDoc ∷ SpagoDhall → Doc GraphicsParam
spagoDhallDoc sd =
  (sd.leadingComment # foldMap \lc → (text ("{-" <> lc <> "-}")))
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
      un ProjectName >>> quote >>> text <$> sd.dependencies
  packages = un LocalImport sd.packages
  sources = pursSquares $ foldWithSeparator leadingComma $
    un SourceGlob >>> quote >>> text <$> sd.sources
