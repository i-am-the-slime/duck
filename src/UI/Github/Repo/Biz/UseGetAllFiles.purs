module UI.Github.Repo.Biz.UseGetAllFiles where

import Yoga.Prelude.View

import Control.Parallel (parallel)
import Data.Array (foldl)
import Data.Array as Array
import Data.Bifunctor (lmap)
import Data.String as String
import Yoga.Tree (Tree, mkLeaf)
import Yoga.Tree.Zipper (Loc)
import Yoga.Tree.Zipper as Loc
import Data.Tuple (fst, snd)
import Effect.Aff (Aff, sequential)
import Network.RemoteData (RemoteData)
import React.Basic.Hooks as React
import UI.FilePath (GithubRepo)
import UI.Github.Repo.Biz.UseGetAllFiles.Types (AllFilesAPIResult, RESTFileInfo)
import UI.Hook.UseRemoteData (UseRemoteData, useRemoteData)
import Yoga.Fetch (fetch)
import Yoga.Fetch as F
import Yoga.Fetch.Impl.Window (windowFetch)
import Yoga.JSON as JSON

useGetAllFiles ∷
  Hook (UseRemoteData GithubRepo String AllFilesAPIResult)
    { data ∷ RemoteData String (Tree RESTFileInfo)
    , load ∷ GithubRepo → Effect Unit
    , reset ∷ Effect Unit
    }
useGetAllFiles = React.do
  { data: d, load, reset } ← useRemoteData getAllFiles
  pure { data: d <#> toTree, load, reset }

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
