module Biz.Tool where

import Prelude

import Backend.Tool.Types (ToolPath(..))
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.String (trim)
import Effect.Aff (Aff)
import Node.ChildProcess (defaultSpawnOptions)
import Node.ChildProcess as Exit
import Sunde (spawn)

runToolAndGetStdout ∷ Array String → ToolPath → Aff (Either String String)
runToolAndGetStdout args toolPath = do
  { exit, stderr, stdout } ← spawnCmd toolPath
  pure case exit of
    Exit.Normally 0 → Right (trim stdout)
    Exit.Normally other →
      Left ("Unexpected exit code: " <> show other <> "\n" <> stderr)
    Exit.BySignal signal →
      Left ("Interrupted by signal: " <> show signal <> "\n" <> stderr)
  where
  spawnCmd (ToolPath path) = spawn { cmd: path, args, stdin: Nothing }
    defaultSpawnOptions
