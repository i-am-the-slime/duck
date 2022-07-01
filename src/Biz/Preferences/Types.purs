module Biz.Preferences.Types where

import Biz.Github.Types as Github
import Data.Maybe (Maybe(..))
import Node.Path (FilePath)

type AppPreferences =
  { solutions ∷ Array FilePath
  , githubPersonalAccessToken ∷ Maybe Github.PersonalAccessToken
  }

defaultAppPreferences ∷ AppPreferences
defaultAppPreferences = { solutions: [], githubPersonalAccessToken: Nothing }