module Spago.PackagesDhall.Printer where

import Prelude

import Biz.Github.Types (Repository(..))
import Biz.Spago.Types (Version(..))
import Data.Foldable (foldMap)
import Data.Newtype (un)
import Dodo (Doc, break, flexGroup, foldWithSeparator, indent, spaceBreak, text)
import Dodo.Ansi (GraphicsParam)
import Dodo.Common (leadingComma, pursCurlies, pursSquares)
import Spago.PackagesDhall.Types (Change(..), PackagesDhall)
import Spago.SpagoDhall.Types (DependencyName(..))

packagesDhallDoc ∷ PackagesDhall → Doc GraphicsParam
packagesDhallDoc pd =
  comment
    <> break
    <> upstream
    <> changes
    <> break
  where
  comment = text ("{-" <> pd.leadingComment <> "-}")
  upstream = flexGroup
    ( text "let upstream =" <> spaceBreak
        <> indent
          ( indent $ indent $ text pd.packageSet.link <>
              ( pd.packageSet.sha # foldMap \hash →
                  (indent (spaceBreak <> text hash))
              )
          )
        <> break
        <> break
        <> text "in  upstream"
    )
  changes = pd.changes #
    foldMap
      \{ change, name } → break <>
        ( flexGroup $ indent
            $ case change of
                RepoChange (Repository repo) →
                  withEntry ((un DependencyName name <> ".repo"))
                    (text $ show repo)
                VersionChange (Version version) →
                  withEntry ((un DependencyName name <> ".version"))
                    (text $ show version)
                DependenciesChange deps →
                  withEntry ((un DependencyName name <> ".dependencies")) $
                    dependencies deps
                CompleteChange { repo, version, dependencies: deps } →
                  withEntry ((un DependencyName name))
                    $ flexGroup
                    $ pursCurlies
                    $ foldWithSeparator leadingComma
                        [ text "repo =" <> flexGroup
                            ( spaceBreak <> indent
                                ( indent
                                    (text (show repo))
                                )
                            )
                        , text "version =" <> flexGroup
                            ( spaceBreak <>
                                ( indent $ indent
                                    (text (show version))
                                )
                            )
                        , text "dependencies =" <> flexGroup
                            ( spaceBreak <>
                                ( indent $ indent
                                    (dependencies deps)
                                )
                            )
                        ]
        )
  withEntry name content = (text "with ") <> text name <> text " ="
    <> spaceBreak
    <>
      (flexGroup $ indent content)
  dependencies deps =
    pursSquares $ foldWithSeparator leadingComma $
      un DependencyName >>> show >>> text <$> deps
