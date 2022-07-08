module Biz.Spago.Service where

import Prelude

import Backend.Tool.Spago.Types (SpagoGlobalCacheDir(..))
import Backend.Tool.Types (ToolPath)
import Biz.Tool (runToolAndGetStdout)
import Data.Either (Either)
import Effect.Aff (Aff)

getGlobalCacheDir ∷ ToolPath → Aff (Either String SpagoGlobalCacheDir)
getGlobalCacheDir = map (SpagoGlobalCacheDir <$> _)
  <<< runToolAndGetStdout [ "path", "global-cache" ]
