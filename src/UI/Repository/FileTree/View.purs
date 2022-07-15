module UI.Repository.FileTree.View where

import Prelude
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
import Data.Tree (Tree, mkLeaf)
import Data.Tree.Zipper (Loc)
import Data.Tree.Zipper as Loc
import Data.Tuple (fst, snd)
import Effect.Aff (Aff, attempt, error, sequential)
import Fahrtwind (background, background', borderBottom, borderCol, borderCol', disabled, flexCol, flexGrow, flexRow, full, gap, height, height', heightFull, hover, invisible, itemsCenter, justifyBetween, justifyCenter, mB, mL, mR, mX, mY, maxHeight', minHeight, minHeight', minWidth, opacity, overflowHidden, overflowVisible, overflowXHidden, overflowYHidden, overflowYScroll, pL, pR, pT, pX, pY, positionAbsolute, positionRelative, roundedDefault, textSm, transition, userSelectNone, widthAndHeight, widthFull)
import Fahrtwind as FW
import Fahrtwind.Icon.Heroicons as Heroicon
import Foreign.Object as Object
import Framer.Motion as M
import Framer.Motion.Hook (useSpringWithMotionValue)
import MotionValue (MotionValue, useMotionValue)
import MotionValue as MotionValue
import Plumage.Prelude.Style (Style, width)
import Plumage.Util.HTML as P
import React.Basic.DOM as R
import React.Basic.Emotion as E
import React.Basic.Hooks as React
import UI.Component as UI
import UI.FilePath (GithubRepo)
import UI.Hook.UseRemoteData (useRemoteData)
import Unsafe.Coerce (unsafeCoerce)
import Yoga.Block as Block
import Yoga.Block.Atom.Button.Types as Button
import Yoga.Block.Container.Style (col, colourWithAlpha, colourWithDarkLightAlpha)
import Yoga.Block.Hook.UseStateEq (useStateEq')
import Yoga.Block.Internal.CSS (transparent)
import Yoga.Fetch (fetch)
import Yoga.Fetch as F
import Yoga.Fetch.Impl.Window (windowFetch)
import Yoga.JSON as JSON

type Props =
  { repo ∷ GithubRepo
  , defaultBranch ∷ String
  , setSelectedFile ∷ Maybe String → Effect Unit
  , selectedFileʔ ∷ Maybe String
  }

getAllFiles ∷ Props → Aff (Either String AllFilesAPIResult)
getAllFiles { defaultBranch, repo } = do
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
  UI.component "FileTree" \ctx props → React.do
    let { repo, defaultBranch } = props
    allFiles ← useRemoteData getAllFiles
    locʔ /\ setLoc ← React.useState' Nothing

    useEffect repo do
      allFiles.load props
      mempty

    useEffect allFiles.data do
      for_ allFiles.data
        ( \d → d # toTree # Loc.fromTree # \loc → setLoc
            (Just $ loc)
        )
      mempty

    pure $ case locʔ of
      Nothing → R.text "Loading..."
      Just loc → treeView
        { loc
        , setLoc: setLoc <<< Just
        , selectedʔ: props.selectedFileʔ
        , setSelected: props.setSelectedFile
        }

mkPresentationalView ∷
  React.Component
    { loc ∷ Loc RESTFileInfo
    , setLoc ∷ Loc RESTFileInfo → Effect Unit
    , selectedʔ ∷ Maybe String
    , setSelected ∷ (Maybe String) → Effect Unit
    }
mkPresentationalView = React.component "Tree" \props → React.do
  let { loc, setLoc, setSelected, selectedʔ } = props
  xPos ← useMotionValue 0.0
  tmpXPos ← useMotionValue 0.0
  tmpLocʔ /\ setTmpLoc ← React.useState' Nothing
  ref ← React.useRef null
  theWidth /\ setTheWidth ← useStateEq' 0.0

  useEffectAlways do
    when (theWidth == 0.0) do
      bbʔ ← getBoundingBoxFromRef ref
      for_ bbʔ \bb → do
        setTheWidth $ bb.width
    mempty

  animatedXPos ← useSpringWithMotionValue xPos {}
  animatedTmpXPos ← useSpringWithMotionValue tmpXPos {}

  useEffectOnce do
    animatedTmpXPos # MotionValue.onChange \v →
      when (tmpLocʔ # isJust) do
        when (v == theWidth || v == (-theWidth)) do
          setTmpLoc Nothing

  useEffect tmpLocʔ do
    case tmpLocʔ of
      -- Move in from right
      Just tmpLoc | tmpLocʔ == Loc.up loc → do

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

  let numChildren = Loc.children loc # Array.length
  let numTmpChildren = Loc.children <$> tmpLocʔ <#> Array.length # fromMaybe 0
  let
    children = (0 .. (numChildren - 1)) # traverse (\i → Loc.childAt i loc)
      # fromMaybe []
  let
    tmpChildren = (0 .. (numTmpChildren - 1))
      # traverse (\i → tmpLocʔ >>= Loc.childAt i)
      # fromMaybe []
  let parentʔ = Loc.up loc
  pure $ R.div'
    </*
      { ref
      , css: flexCol <> heightFull <> background' col.backgroundBright3
      }
    />
      [ P.div_ (borderBottom 1 <> borderCol' col.backgroundBright5)
          [ Block.button
              { disabled: parentʔ # isNothing
              , css: pL 8 <> pR 16 <> pY 3 <> mY 4 <> (disabled invisible)
                  <> height 28
                  <> mL 8
              , buttonShape: Button.Flat
              , onClick: handler_
                  ( for_ parentʔ
                      ( \l → do
                          setTmpLoc (Just loc)
                          setLoc l
                      )
                  )
              }
              [ P.div_ (flexRow <> gap 4 <> itemsCenter)
                  [ P.div_
                      ( widthAndHeight 12 <> E.css
                          { "& > svg > path": E.nested $ E.css
                              { strokeWidth: E.str "3px" }
                          }
                      )
                      [ Heroicon.chevronLeft ]
                  , R.div_
                      [ R.text $ "/" <> ((Loc.value loc).path) ]
                  ]
              ]
          ]

      , M.div
          </*
            { css: positionRelative
                <> widthFull
                <> heightFull
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
  P.div_ (pX 4 <> widthFull)
    [ R.div'
        </*
          { css: fileEntryStyle
          , _aria:
              if Just path == selectedʔ then Object.singleton "selected" "true"
              else mempty
          , onClick: handler_ $ onClick
          }
        />
          [ P.div_ (widthAndHeight 16)
              [ if fileType == "tree" then Heroicon.folder
                else Heroicon.document
              ]
          , P.div_ (flexRow <> itemsCenter <> justifyBetween <> flexGrow 2)
              [ R.text
                  ( String.split (Pattern "/") path # Array.last # fromMaybe
                      path
                  )
              , guard (fileType == "tree") $
                  P.div_ (widthAndHeight 16)
                    [ Heroicon.chevronRight
                    ]
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
    <>
      ( E.css
          { """&[aria-selected="true"]""": E.nested
              (background' $ col.highlight)
          }
      )
    <> hover
      ( background'
          ( E.str $ colourWithDarkLightAlpha.text
              { lightAlpha: 0.05, darkAlpha: 0.14 }
          )
          <> roundedDefault
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
