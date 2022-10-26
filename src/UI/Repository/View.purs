module UI.Repository.View where

import Yoga.Prelude.View

import Fahrtwind (screenLg, screenMd, screenXl, text2xl, textLg, textXl)
import Markdown (parseMarkDown)
import React.Basic.DOM as R
import React.Basic.Hooks as React
import UI.Component as UI
import UI.FilePath (GithubRepo)
import UI.Hook.UseGetFileInRepo (useGetTextFileInRepo)
import UI.Navigation.ThemeSwitcher (useTheme)
import UI.Repository.Style as Style
import Yoga.Block as Block
import Yoga.Block.Container.Style (DarkOrLightMode(..))

mkView ∷ UI.Component GithubRepo
mkView = UI.component "Repository" \ctx props → React.do
  readme /\ getFile ← useGetTextFileInRepo ctx
  result ← React.useMemo readme (\_ → readme <#> parseMarkDown)
  { theme } ← useTheme

  useEffect props do
    getFile
      { revision_and_file: "HEAD:README.md"
      , owner: props.owner
      , name: props.repoName
      }
    mempty

  pure $ result # foldMap \__html →
    Block.centre
      { css: screenMd textLg <> screenLg textXl <> screenXl text2xl
      }
      [ R.div' </*>
          { className: "readme-markdown"
          , css: Style.markdownStyle <> case theme of
              LightMode → Style.lightTheme
              DarkMode → Style.darkTheme
          , dangerouslySetInnerHTML: { __html }
          }
      ]
