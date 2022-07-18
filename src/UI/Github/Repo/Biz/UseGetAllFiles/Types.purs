module UI.Github.Repo.Biz.UseGetAllFiles.Types where

import Yoga.Prelude.View

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