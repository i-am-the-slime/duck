module UI.Navigation.HeaderBar.Style where

import Yoga.Prelude.Style

import UI.Style (toolbarBackground, toolbarBorderCol)
import Yoga.Block.Container.Style (col, colour)

headerBar ∷ Style
headerBar =
  displayGrid
    <> css
      { gridTemplateColumns: str "minmax(10px, max-content) 90px"
      , gridTemplateRows: str "50px"
      , overflowX: auto
      , overflowY: hidden
      }
    <> gap 8
    <> justifyBetween
    <> flexNoWrap
    <> itemsCenter
    <> toolbarBackground
    <> background' col.highlight
    <> heightFull
    <> borderBottom 1
    <> toolbarBorderCol
    <> fontSemiMedium
    <> textCol' col.textPaler1
    <> textSm
    <> pY 12
    <> pX 24
    <> widthFull

breadcrumbContainerWrapper ∷ Style
breadcrumbContainerWrapper = flexRow <> justifyStart
  <> css
    { borderRadius: str "9px"
    }
  <> border 1
  <> borderCol' col.backgroundLayer2
  <> overflowHidden

breadcrumbContainer ∷ Style
breadcrumbContainer =
  flexRow
    <> css
      { overflowX: str "visible"
      , flexBasis: str "auto"
      , flexDirection: str "row-reverse"
      , "& > a:last-of-type": nested $ pL 12 <> mL 0
      , "& > a:first-of-type": nested
          ( css { "&:after": nested $ css { content: none } }
              <> pR 12
              <> mR 0
              <> css
                { borderRadius: str "8px"
                , "--bg": col.backgroundLayer4
                }
          )
      }

dots ∷ Style
dots = widthAndHeight 22 <> textCol' col.textPaler2

link ∷ Style
link = pL 30
  <> pY 3
  <> height 28
  <> positionRelative
  <> mR 18
  <> mL (-26)
  -- <> overflowVisible
  -- <> overflowHidden
  <> textSm
  <> css
    { "--bg": col.backgroundLayer3
    , borderRight: str "1px solid var(--bg)"
    , background: str "var(--bg)"
    , whiteSpace: str "nowrap"
    , "&:after": nested arrow

    }
  <> hover (css { "--bg": col.backgroundBright3 })

arrow ∷ Style
arrow =
  ( css
      { content: str "''"
      , overflowX: auto
      , border: str $ "1px solid " <> colour.backgroundLayer2
      , position: str "absolute"
      , background: str "var(--bg)"
      , top: str "3px"
      , right: str "-11px"
      , borderRadius: str "0 3px 0 0"
      , clipPath: str "polygon(0 0, 100% 0, 100% 100%)"
      , transform: str "rotate(45deg)"
      }
      <> widthAndHeight 22
      <> ignoreClicks
  )
