module UI.Repository.Style where

import Yoga.Prelude.Style

import Fahrtwind (acceptClicks, background, background', border, borderCol', fontBold, fontFamilyOrSerif, fontNormal, fontSemibold, height, hover, mX, maxWidth', overflowXScroll, pB, pT, pX, pY, positionAbsolute, rounded2xl, roundedDefault, roundedMd, roundedSm, screenLg, text2xl, text3xl, text4xl, textCol', textDefault, textLg, textSized, textSm, textXl, tracking, transform, transition, userSelectText, width)
import Fahrtwind as F
import Yoga.Block.Container.Style (col, darkModeVariables)

markdownStyle ∷ Style
markdownStyle =
  css
    { "WebkitFontFeatureSettings": str """"liga" on, "calt" on"""
    , "WebkitFontSmoothing": str "antialiased"
    , textRendering: str "optimizeLegibility"
    , "h1": nested $ text4xl <> fontBold <> textCol' col.textPaler1 <> pB 24
    , "h2": nested $ text2xl <> fontBold <> textCol' col.textPaler1 <> pT 28 <>
        pB 12
    , "h3": nested $ textXl <> fontSemibold <> textCol' col.textPaler1 <> pT 24
        <> pB 8
    , "p, li": nested $ textLg <> fontNormal
        <> maxWidth' (70.0 # ch)
        <> fontFamilyOrSerif "Georgia"
        <> textCol' col.text
    , "pre": nested $ background' col.backgroundBright1 <> pX 16
        <> roundedMd
        <> overflowXScroll
        <> transition "all 0.5s ease"
    , "code": nested $ background' col.backgroundBright3 <> pX 4 <> pY 1
        <> roundedDefault
        <> textSized 0.94 1.5
        <> tracking (-0.006)
        <> border 1
        <> borderCol' col.backgroundBright5
    , "pre > code": nested $ pX 0 <> border 0 <> background transparent
    , "a": nested (textCol' col.highlightTextOnBackground)

    , "& > * + *": nested $ pY 12
    , "li": nested $ css
        { listStyleType: str "→"
        , listStylePosition: str "inside"
        }
    }
    <> textDefault
    <> userSelectText
    <> screenLg
      ( css { "p, li": nested $ textXl <> fontNormal }
      )

darkTheme ∷ Style
darkTheme = css
  { ".hljs": nested $ css
      { background: str "#011627"
      , color: str "#d6deeb"
      }
  , ".hljs-keyword": nested $ css
      { color: str "#c792ea"
      , fontStyle: str "italic"
      }
  , ".hljs-built_in": nested $ css
      { color: str "#addb67"
      , fontStyle: str "italic"
      }
  , ".hljs-type": nested $ css
      { color: str "#82aaff"
      }
  , ".hljs-literal": nested $ css
      { color: str "#ff5874"
      }
  , ".hljs-number": nested $ css
      { color: str "#F78C6C"
      }
  , ".hljs-regexp": nested $ css
      { color: str "#5ca7e4"
      }
  , ".hljs-string": nested $ css
      { color: str "#ecc48d"
      }
  , ".hljs-subst": nested $ css
      { color: str "#d3423e"
      }
  , ".hljs-symbol": nested $ css
      { color: str "#82aaff"
      }
  , ".hljs-class": nested $ css
      { color: str "#ffcb8b"
      }
  , ".hljs-function": nested $ css
      { color: str "#82AAFF"
      }
  , ".hljs-title": nested $ css
      { color: str "#DCDCAA"
      , fontStyle: str "italic"
      }
  , ".hljs-params": nested $ css
      { color: str "#7fdbca"
      }
  ,
    -- /* Meta */
    ".hljs-comment": nested $ css
      { color: str "#637777"
      , fontStyle: str "italic"
      }
  , ".hljs-doctag": nested $ css
      { color: str "#7fdbca"
      }
  , ".hljs-meta": nested $ css
      { color: str "#82aaff"
      }
  , ".hljs-meta .hljs-keyword": nested $ css
      { color: str "#82aaff"
      }
  , ".hljs-meta .hljs-string": nested $ css
      { color: str "#ecc48d"
      }
  ,
    -- /* Tags, attributes, config */
    ".hljs-section": nested $ css
      { color: str "#82b1ff"
      }
  , ".hljs-tag, .hljs-name": nested $ css
      { color: str "#7fdbca"
      }
  , ".hljs-attr": nested $ css
      { color: str "#7fdbca"
      }
  , ".hljs-attribute": nested $ css
      { color: str "#80cbc4"
      }
  , ".hljs-variable": nested $ css
      { color: str "#addb67"
      }
  ,
    -- /* Markup */
    ".hljs-bullet": nested $ css
      { color: str "#d9f5dd"
      }
  , ".hljs-code": nested $ css
      { color: str "#80CBC4"
      }
  , ".hljs-emphasis": nested $ css
      { color: str "#c792ea"
      , fontStyle: str "italic"
      }
  , ".hljs-strong": nested $ css
      { color: str "#addb67"
      , fontWeight: str "bold"
      }
  , ".hljs-formula": nested $ css
      { color: str "#c792ea"
      }
  , ".hljs-link": nested $ css
      { color: str "#ff869a"
      }
  , ".hljs-quote": nested $ css
      { color: str "#697098"
      , fontStyle: str "italic"
      }
  ,
    -- /* CSS */
    ".hljs-selector-tag": nested $ css
      { color: str "#ff6363"
      }
  , ".hljs-selector-id": nested $ css
      { color: str "#fad430"
      }
  , ".hljs-selector-class": nested $ css
      { color: str "#addb67"
      , fontStyle: str "italic"
      }
  , ".hljs-selector-attr, .hljs-selector-pseudo": nested $ css
      { color: str "#c792ea"
      , fontStyle: str "italic"
      }
  ,
    -- /* Templates */
    ".hljs-template-tag": nested $ css
      { color: str "#c792ea"
      }
  , ".hljs-template-variable": nested $ css
      { color: str "#addb67"
      }
  ,
    -- /* diff */
    ".hljs-addition": nested $ css
      { color: str "#addb67ff"
      , fontStyle: str "italic"
      }
  , ".hljs-deletion": nested $ css
      { color: str "#EF535090"
      , fontStyle: str "italic"
      }
  }

lightTheme ∷ Style
lightTheme = css
  { ".hljs": nested $ css
      { color: str "#383a42"
      , background: str "#fafafa"
      }
  , ".hljs-comment, .hljs-quote": nested $ css
      { color: str "#a0a1a7"
      , fontStyle: str "italic"
      }
  , ".hljs-doctag, .hljs-keyword, .hljs-formula": nested $ css
      { color: str "#a626a4"
      }
  , ".hljs-section, .hljs-name, .hljs-selector-tag, .hljs-deletion, .hljs-subst":
      nested $ css
        { color: str "#e45649"
        }
  , ".hljs-literal": nested $ css
      { color: str "#0184bb"
      }
  , ".hljs-string, .hljs-regexp, .hljs-addition, .hljs-attribute, .hljs-meta .hljs-string":
      nested $ css
        { color: str "#50a14f"
        }
  , ".hljs-attr, .hljs-variable, .hljs-template-variable, .hljs-type, .hljs-selector-class, .hljs-selector-attr, .hljs-selector-pseudo, .hljs-number":
      nested $ css
        { color: str "#986801"
        }
  , ".hljs-symbol, .hljs-bullet, .hljs-link, .hljs-meta, .hljs-selector-id, .hljs-title":
      nested $ css
        { color: str "#4078f2"
        }
  , ".hljs-built_in, .hljs-title.class_, .hljs-class .hljs-title": nested $ css
      { color: str "#c18401"
      }
  , ".hljs-emphasis": nested $ css
      { fontStyle: str "italic"
      }
  , ".hljs-strong": nested $ css
      { fontWeight: str "bold"
      }
  , ".hljs-link": nested $ css
      { textDecoration: str "underline"
      }
  }
