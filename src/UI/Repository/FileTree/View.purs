module UI.Repository.FileTree.View
  ( AllFilesAPIResult
  , PresentationalProps
  , Props
  , RESTFileInfo
  , dummyInfo
  , getAllFiles
  , mkPresentationalView
  , mkView
  , renderFile
  , toTree
  ) where

import Yoga.Prelude.View

import Control.Parallel (parallel)
import Data.Array (foldl, (..))
import Data.Array as Array
import Data.Bifunctor (lmap)
import Data.Int as Int
import Data.Maybe (isNothing)
import Data.String (Pattern(..))
import Data.String as String
import Data.Traversable (traverse)
import Data.Tuple (fst, snd)
import Effect.Aff (Aff, sequential)
import Fahrtwind (background', borderBottom, borderCol', cursorDefault, disabled, flexCol, flexGrow, flexRow, flexShrink, gap, height, heightFull, hover, invisible, itemsCenter, justifyBetween, mL, mY, maxWidth, minWidth, overflowHidden, overflowYScroll, pL, pR, pX, pY, positionAbsolute, positionRelative, roundedDefault, textCol', textOverflowEllipsis, textSm, userSelectNone, widthAndHeight, widthFull)
import Fahrtwind as FW
import Fahrtwind.Icon.Heroicons as Heroicon
import Foreign.Object as Object
import Framer.Motion as M
import Framer.Motion.Hook (useSpringWithMotionValue)
import MotionValue (useMotionValue)
import MotionValue as MotionValue
import React.Basic.DOM as R
import React.Basic.Emotion as E
import React.Basic.Hooks as React
import UI.Component as UI
import UI.FilePath (GithubRepo)
import UI.Hook.UseRemoteData (useRemoteData)
import Web.DOM.ResizeObserver (resizeObserver)
import Web.DOM.ResizeObserver as ResizeObserver
import Web.HTML.HTMLElement as HTMLElement
import Yoga.Block as Block
import Yoga.Block.Atom.Button.Types as Button
import Yoga.Block.Container.Style (col, colourWithDarkLightAlpha)
import Yoga.Block.Hook.UseStateEq (useStateEq')
import Yoga.Fetch (fetch)
import Yoga.Fetch as F
import Yoga.Fetch.Impl.Window (windowFetch)
import Yoga.JSON as JSON
import Yoga.Prelude.Style (Style)
import Yoga.Prelude.View as P
import Yoga.Tree (Tree, mkLeaf)
import Yoga.Tree.Zipper (Loc)
import Yoga.Tree.Zipper as Loc

type Props =
  { repo ∷ GithubRepo
  , defaultBranch ∷ String
  , setSelectedFile ∷ Maybe String → Effect Unit
  , selectedFileʔ ∷ Maybe String
  }

getAllFiles ∷ GithubRepo → Aff (Either String AllFilesAPIResult)
getAllFiles repo = do
  response ← sequential ado
    r1 ← parallel $ mkRequest "main" <#> notFoundToLeft
    r2 ← parallel $ mkRequest "master" <#> notFoundToLeft
    in r1 <|> r2
  case response of
    Right res → do
      body ← F.json res
      pure $ (JSON.read body # lmap show)
    Left err → pure $ Left (show err)
  where
  notFoundToLeft res =
    if F.statusCode res == 404 then Left "Not Found" else Right res
  mkRequest branch =
    fetch windowFetch
      ( F.URL $ "https://api.github.com/repos/" <> repo.owner <> "/"
          <> repo.repoName
          <> "/git/trees/"
          <> branch
          <> "?recursive=1"
      )
      { method: F.getMethod }

mkView ∷ UI.Component Props
mkView = do
  treeView ← mkPresentationalView # liftEffect
  UI.component "FileTree" \_ctx props → React.do
    let { repo } = props
    allFiles ← useRemoteData getAllFiles
    locʔ /\ setLoc ← React.useState' Nothing

    useEffect repo do
      allFiles.load props.repo
      mempty

    useEffect allFiles.data do
      for_ allFiles.data
        (toTree >>> Loc.fromTree >>> Just >>> setLoc)
      mempty

    pure $ case locʔ of
      Nothing → R.text "Loading..."
      Just loc → treeView
        { loc
        , setLoc: setLoc <<< Just
        , selectedʔ: props.selectedFileʔ
        , setSelected: props.setSelectedFile
        }

type PresentationalProps =
  { loc ∷ Loc RESTFileInfo
  , setLoc ∷ Loc RESTFileInfo → Effect Unit
  , selectedʔ ∷ Maybe String
  , setSelected ∷ (Maybe String) → Effect Unit
  }

mkPresentationalView ∷ React.Component PresentationalProps
mkPresentationalView = React.component "Tree" \props → React.do
  let { loc, setLoc, setSelected, selectedʔ } = props
  xPos ← useMotionValue 0.0
  tmpXPos ← useMotionValue 0.0
  tmpLocʔ /\ setTmpLoc ← React.useState' Nothing
  ref ← React.useRef null
  theWidth /\ setTheWidth ← useStateEq' 0.0

  let
    calcWidth = do
      getBoundingBoxFromRef ref >>= traverse_ (setTheWidth <<< _.width)

  useEffectAlways do
    when (theWidth == 0.0) calcWidth
    mempty

  useEffectOnce do
    htmlElementʔ ← getHTMLElementFromRef ref
    case htmlElementʔ of
      Just htmlElement → do
        observer ← resizeObserver \_ _ → do
          calcWidth
        let element = HTMLElement.toElement htmlElement
        ResizeObserver.observe ResizeObserver.ContentBox observer element
        pure $ element # ResizeObserver.unobserve observer
      Nothing → mempty

  animatedXPos ← useSpringWithMotionValue xPos {}

  animatedTmpXPos ← useSpringWithMotionValue tmpXPos {}

  useEffect (tmpLocʔ /\ theWidth) do
    animatedTmpXPos # MotionValue.onChange \v → do
      when (tmpLocʔ # isJust) do
        when (v == theWidth || v == (-theWidth)) do
          setTmpLoc Nothing
          mempty

  useEffect (theWidth /\ tmpLocʔ) do
    case tmpLocʔ of
      -- Move in from right
      Just _tmpLoc | tmpLocʔ == Loc.up loc → do

        tmpXPos # MotionValue.setButDoNotRender (0.0)
        animatedTmpXPos # MotionValue.setButDoNotRender (0.0)
        tmpXPos # MotionValue.set (-theWidth)

        xPos # MotionValue.setButDoNotRender (theWidth)
        animatedXPos # MotionValue.setButDoNotRender (theWidth)
        xPos # MotionValue.set (0.0)

      -- Move left
      Just _ → do

        tmpXPos # MotionValue.setButDoNotRender (0.0)
        animatedTmpXPos # MotionValue.setButDoNotRender (0.0)
        tmpXPos # MotionValue.set (theWidth)

        xPos # MotionValue.setButDoNotRender (-theWidth)
        animatedXPos # MotionValue.setButDoNotRender (-theWidth)
        xPos # MotionValue.set (0.0)

      Nothing → do
        mempty
    mempty

  let
    numChildren = Loc.children loc # Array.length

    numTmpChildren = Loc.children <$> tmpLocʔ <#> Array.length # fromMaybe 0

    children = (0 .. (numChildren - 1)) # traverse (\i → Loc.childAt i loc)
      # fromMaybe []

    tmpChildren = (0 .. (numTmpChildren - 1))
      # traverse (\i → tmpLocʔ >>= Loc.childAt i)
      # fromMaybe []

    parentʔ = Loc.up loc

  pure $ R.div'
    </*
      { ref
      , css: flexCol <> heightFull <> background' col.backgroundBright3
          <> widthFull
      }
    />
      [ P.div_ (borderBottom 1 <> borderCol' col.backgroundBright5)
          [ Block.button
              { disabled: parentʔ # isNothing
              , css: pL 8 <> pR 16 <> pY 3 <> mY 4
                  <>
                    ( disabled
                        ( E.css
                            { "& > div > svg:first-of-type": E.nested invisible
                            }
                        )
                    )
                  <> cursorDefault
                  <> height 28
                  <> overflowHidden
                  <> mL 16
              , buttonShape: Button.Flat
              , onClick: handler_
                  ( for_ parentʔ
                      ( \l → do
                          setTmpLoc (Just loc)
                          setLoc l
                      )
                  )
              }
              [ P.div_
                  ( flexRow <> gap 4 <> itemsCenter
                      <> maxWidth (Int.round theWidth - 50)

                  )
                  [ P.div_
                      ( widthAndHeight 12 <> flexShrink 0 <> E.css
                          { "& > svg > path": E.nested $ E.css
                              { strokeWidth: E.str "3px" }
                          }
                      )
                      [ Heroicon.chevronLeft ]
                  , P.div_
                      ( minWidth 5
                          <> overflowHidden
                          <> flexShrink 2
                          <> textOverflowEllipsis
                          <> E.css
                            { whiteSpace: E.nowrap
                            , direction: E.str "rtl"
                            }
                      )
                      [ R.text $ "/" <> ((Loc.value loc).path) ]
                  ]
              ]
          ]

      , M.div
          </*
            { css: positionRelative
                <> widthFull
                <> heightFull
                <> pL 16
                <> overflowHidden
                <> flexGrow 2
            }
          />
            [ guard (isJust tmpLocʔ) $ M.div
                </*
                  { css: FW.top 0 <> FW.left 0 <> widthFull <> positionAbsolute
                  , style: R.css { x: animatedTmpXPos }
                  }
                />
                  ( tmpChildren <#> \l → renderFile selectedʔ l mempty
                  )
            , M.div
                </*
                  { css: widthFull
                      <> overflowYScroll
                      <> heightFull
                  , style: R.css { x: animatedXPos }
                  }
                />
                  ( children <#> \l → renderFile selectedʔ l do
                      let tpe = (Loc.value l).type
                      if tpe == "blob" then do
                        setSelected (Just (Loc.value l).path)
                      else if tpe == "tree" then do
                        setLoc l
                        setTmpLoc (Just loc)
                      else do
                        mempty
                  )

            ]
      ]

renderFile ∷
  Maybe String →
  Loc RESTFileInfo →
  (Effect Unit) →
  JSX
renderFile selectedʔ loc onClick = do
  let { path, type: fileType } = Loc.value loc
  R.div'
    </*
      { css: fileEntryStyle
      , _aria:
          if Just path == selectedʔ then Object.singleton "selected" "true"
          else mempty
      , onClick: handler_ $ onClick
      }
    />
      [ P.div_ (widthAndHeight 16 <> flexShrink 0 <> flexGrow 0)
          [ if fileType == "tree" then Heroicon.folder
            else Heroicon.document
          ]
      , P.div_
          ( flexRow <> itemsCenter <> justifyBetween <> flexGrow 1
              <> flexShrink 2
              <> overflowHidden
          )
          [ P.div_
              ( overflowHidden
                  <> E.css { whiteSpace: E.nowrap }
                  <> textOverflowEllipsis
              )
              [ R.text
                  ( String.split (Pattern "/") path # Array.last # fromMaybe
                      path
                  )
              ]
          , guard (fileType == "tree") $
              P.div_ (widthAndHeight 16 <> flexShrink 0 <> flexGrow 0)
                [ Heroicon.chevronRight
                ]
          ]
      ]

fileEntryStyle ∷ Style
fileEntryStyle =
  flexRow
    <> gap 4
    <> itemsCenter
    <> pX 8
    <> pY 4
    <> mY 2
    <> borderCol' col.backgroundLayer2
    <> textSm
    <> userSelectNone
    <> widthFull
    <> roundedDefault
    <> hover
      ( background'
          ( E.str $ colourWithDarkLightAlpha.text
              { lightAlpha: 0.05, darkAlpha: 0.14 }
          )
      )
    <>
      ( E.css
          { """&[aria-selected="true"]""": E.nested
              $ background' col.highlight
              <> textCol' col.highlightText
          }
      )

type AllFilesAPIResult =
  { tree ∷ Array RESTFileInfo
  , truncated ∷ Boolean
  , url ∷ String
  }

type RESTFileInfo =
  { path ∷ String
  , size ∷ Maybe Int
  , type ∷ String
  , url ∷ String
  }

dummyInfo ∷ RESTFileInfo
dummyInfo =
  { path: ""
  , size: Nothing
  , type: ""
  , url: ""
  }

toTree ∷ AllFilesAPIResult → Tree RESTFileInfo
toTree allFiles = snd <$> Loc.toTree (go 1 root splitAtPath)
  where
  root = Loc.fromTree $ mkLeaf ([] /\ (dummyInfo ∷ RESTFileInfo))

  splitAtPath ∷ Array (Array String /\ RESTFileInfo)
  splitAtPath = allFiles.tree <#> (\x → ((splitIt x.path) /\ x))

  splitIt = String.split (String.Pattern "/")

  go ∷
    Int →
    Loc (Array String /\ RESTFileInfo) →
    Array (Array String /\ RESTFileInfo) →
    Loc (Array String /\ RESTFileInfo)
  go depth acc = case _ of
    [] → acc
    xs → do
      let
        { yes: todo, no: rest } =
          xs # Array.partition (fst >>> Array.length >>> (_ == depth))
      let newAcc = foldl insert acc todo
      go (depth + 1) newAcc rest

  insert ∷
    Loc (Array String /\ RESTFileInfo) →
    (Array String /\ RESTFileInfo) →
    Loc (Array String /\ RESTFileInfo)
  insert loc (path /\ x) = do
    loc
      # Loc.findFromRootWhere (\(path' /\ _) → Array.dropEnd 1 path == path')
      # fromMaybe (Loc.root loc)
      # Loc.insertChild (mkLeaf (path /\ x))
