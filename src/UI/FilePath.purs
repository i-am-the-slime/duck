module UI.FilePath where

import Prelude
import Yoga.Prelude.View

import Biz.Spago.Types (Repository(..))
import Color (mixCubehelix)
import Color as Color
import Data.Int as Int
import Data.Newtype (un)
import Data.Ord (abs)
import Data.Ord as Int
import Data.String (Pattern(..), split, stripPrefix)
import Data.String as String
import Debug (spy)
import Fahrtwind (TailwindColor, background, background', border, borderCol, borderCol', coolGray, fontFamilyOrMono, fontLight, fontMedium, fontSemiMedium, gray, hue, pX, pY, roundedDefault, textCol, textSm, textTransformUppercase, trackingWide, withLightness)
import Plumage.Util.HTML as P
import React.Basic (JSX)
import React.Basic.DOM as R
import Yoga.Block as Block
import Yoga.Block.Container.Style (col)

renderFilePath ∷ String → JSX
renderFilePath p = R.code'
  </*
    { css: border 1 <> roundedDefault
        <> borderCol' col.backgroundBright5
        <> textSm
        <> pX 4
        <> pY 2
        <> background' col.backgroundLayer3
    }
  /> [ R.text p ]

type GithubRepo =
  { userOrOrg ∷ String
  , repoName ∷ String
  }

renderTag col p = R.span'
  </*
    { css: roundedDefault
        <> textCol col._300
        <> textSm
        <> fontSemiMedium
        <> trackingWide
        <> pX 4
        <> pY 2
        <> background col._800
    }
  /> [ R.text p ]

renderGithubRepo ∷ GithubRepo → JSX
renderGithubRepo { userOrOrg, repoName } =
  Block.cluster { space: "8px" }
    [ P.span_ (textTransformUppercase) [ renderTag coolGray "github" ]
    , renderTag (toTailwindCol userOrOrg) userOrOrg
    , R.text repoName
    ]

toTailwindCol ∷ String → TailwindColor
toTailwindCol s =
  if baseHue # between 230.0 280.0 then
    colFromVeryDarkHue
  else if
    (baseHue # between 352.0 360.0) ||
      (baseHue # between 0.0 15.0) then
    colFromRedHue
  else if baseHue # between 180.0 350.0 then colFromDarkHue
  else if
    (baseHue # between 20.0 100.0)
      || (baseHue # between 150.0 200.0) then
    colFromLightHue
  else colFromMediumHue
  where
  baseHue = Int.toNumber (s # cyrb53 10 # (_ `mod` 360))

  colFromRedHue =
    coolGray

  colFromLightHue =
    { _50: Color.hsv baseHue 0.8 0.90
    , _100: Color.hsv baseHue 0.8 0.82
    , _200: Color.hsv baseHue 0.8 0.71
    , _300: Color.hsv baseHue 1.0 0.88
    , _400: Color.hsv baseHue 0.9 0.50
    , _500: Color.hsv baseHue 0.9 0.40
    , _600: Color.hsv baseHue 1.0 0.30
    , _700: Color.hsv baseHue 0.8 0.22
    , _800: Color.hsv baseHue 0.8 0.22
    , _900: Color.hsv baseHue 1.0 0.05
    }
  colFromMediumHue =
    { _50: Color.hsv baseHue 0.8 0.98
    , _100: Color.hsv baseHue 0.8 0.95
    , _200: Color.hsv baseHue 0.8 0.9
    , _300: Color.hsv baseHue 0.82 0.88
    , _400: Color.hsv baseHue 0.9 0.84
    , _500: Color.hsv baseHue 0.9 0.5
    , _600: Color.hsv baseHue 1.0 0.4
    , _700: Color.hsv baseHue 1.0 0.3
    , _800: Color.hsv baseHue 1.0 0.3
    , _900: Color.hsv baseHue 1.0 0.1
    }
  colFromDarkHue =
    { _50: Color.hsv baseHue 0.7 0.98
    , _100: Color.hsv baseHue 0.7 0.95
    , _200: Color.hsv baseHue 0.7 0.92
    , _300: Color.hsv baseHue 0.45 0.97
    , _400: Color.hsv baseHue 0.8 0.7
    , _500: Color.hsv baseHue 0.8 0.6
    , _600: Color.hsv baseHue 0.9 0.5
    , _700: Color.hsv baseHue 0.9 0.3
    , _800: Color.hsv baseHue 0.9 0.3
    , _900: Color.hsv baseHue 1.0 0.1
    }
  colFromVeryDarkHue =
    { _50: Color.hsv baseHue 0.7 0.98
    , _100: Color.hsv baseHue 0.7 0.95
    , _200: Color.hsv baseHue 0.7 0.92
    , _300: Color.hsv baseHue 0.3 0.97
    , _400: Color.hsv baseHue 0.8 0.7
    , _500: Color.hsv baseHue 0.8 0.6
    , _600: Color.hsv baseHue 0.9 0.5
    , _700: Color.hsv baseHue 0.9 0.3
    , _800: Color.hsv baseHue 0.9 0.3
    , _900: Color.hsv baseHue 1.0 0.1
    }

foreign import hashCode ∷ String → Int
foreign import cyrb53 ∷ Int → String → Int
