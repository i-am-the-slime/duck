module Spago.ExtendedSpagoDhall.Printer where

import Prelude

import Biz.Spago.Types (ProjectName(..), SourceGlob(..))
import Data.Foldable (foldMap)
import Data.Newtype (un)
import Dhall.Types (LocalImport(..))
import Dodo (Doc, break, flexGroup, foldWithSeparator, indent, space, spaceBreak, text)
import Dodo.Ansi (GraphicsParam)
import Dodo.Common (leadingComma, pursCurlies, pursSquares)
import Spago.ExtendedSpagoDhall.Types (ExtendedSpagoDhall)

extendedSpagoDhallDoc ∷ ExtendedSpagoDhall → Doc GraphicsParam
extendedSpagoDhallDoc sd =
  (sd.leadingComment # foldMap \lc → (text ("{-" <> lc <> "-}\n")))
    <>
      ( flexGroup
          ( text "let" <> indent
              ( space
                  <> text name
                  <> space
                  <> text "="
                  <>
                    (indent (indent (indent spaceBreak <> import')))

              )
          )
      )
    <> break
    <> break
    <>
      ( flexGroup (text "in" <> indent (space <> space <> text name))
          <> (space <> text "//" <> break)
          <> flexGroup
            ( indent
                ( indent
                    ( pursCurlies
                        ( ( ( text "sources =" <> flexGroup
                                ( indent
                                    ( indent
                                        (spaceBreak <> sources)
                                    )
                                )
                            )
                          )
                            <> break
                            <>
                              flexGroup
                                ( text (", dependencies =") <> indent
                                    ( flexGroup
                                        ( indent
                                            ( spaceBreak <> flexGroup
                                                dependencies
                                            )
                                        )
                                    )
                                )
                        )
                    )
                )
            )
      )
    <> break
  where
  quote = show
  import' = sd.baseFile.import # un LocalImport # text
  name = sd.baseFile.name
  dependencies = text (name <> ".dependencies") <> space <> text "#" <> indent
    ( spaceBreak <>
        pursSquares
          ( foldWithSeparator leadingComma $
              un ProjectName >>> quote >>> text <$> sd.dependencies
          )
    )
  sources = text (name <> ".sources") <> space <> text "#" <> indent
    ( spaceBreak <> pursSquares
        ( foldWithSeparator leadingComma
            ( un SourceGlob >>> quote >>> text <$> sd.sources
            )
        )
    )
