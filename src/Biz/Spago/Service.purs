module Biz.Spago.Service where

import Prelude

import Backend.Tool.Spago.Types (SpagoGlobalCacheDir(..))
import Backend.Tool.Types (ToolPath)
import Biz.Tool (runToolAndGetStdout)
import Data.Either (Either)
import Data.Maybe (Maybe(..))
import Data.String (trim)
import Effect.Aff (Aff)

getGlobalCacheDir ∷ ToolPath → Aff (Either String SpagoGlobalCacheDir)
getGlobalCacheDir = map ((SpagoGlobalCacheDir <<< trim <<< _.stdout) <$> _)
  <<< \toolPath → runToolAndGetStdout
    { args: [ "path", "global-cache" ]
    , toolPath
    , workingDir: Nothing
    }
