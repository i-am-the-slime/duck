module Biz.Tool where

import Prelude

import Backend.Tool.Types (ToolPath(..))
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.Newtype (un)
import Data.Posix.Signal (Signal(..))
import Data.String (trim)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Node.ChildProcess (defaultSpawnOptions, onExit)
import Node.ChildProcess as CP
import Node.ChildProcess as Exit
import Node.Encoding (Encoding(..))
import Node.Stream (onDataString)
import Sunde (spawn)

runToolAndGetStdout ∷
  { args ∷ Array String
  , workingDir ∷ Maybe String
  , toolPath ∷ ToolPath
  } →
  Aff (Either String { stdout ∷ String, stderr ∷ String })
runToolAndGetStdout { args, workingDir, toolPath } = do
  { exit, stderr, stdout } ← spawnCmd toolPath
  pure case exit of
    Exit.Normally 0 → Right { stdout, stderr }
    Exit.Normally other →
      Left ("Unexpected exit code: " <> show other <> "\n" <> stderr)
    Exit.BySignal signal →
      Left ("Interrupted by signal: " <> show signal <> "\n" <> stderr)
  where
  spawnCmd (ToolPath path) = spawn { cmd: path, args, stdin: Nothing }
    (defaultSpawnOptions { cwd = (workingDir) })

runToolAndSendOutput ∷
  { onStdout ∷ String → Effect Unit
  , onStderr ∷ String → Effect Unit
  , onExit ∷ Boolean → Effect Unit
  } →
  { args ∷ Array String
  , workingDir ∷ Maybe String
  , toolPath ∷ ToolPath
  } →
  Effect ({ kill ∷ Effect Unit })
runToolAndSendOutput respond { args, workingDir, toolPath: ToolPath path } = do
  cp ← CP.spawn path args (defaultSpawnOptions { cwd = workingDir })
  onDataString (CP.stdout cp) UTF8 respond.onStdout
  onDataString (CP.stderr cp) UTF8 respond.onStderr
  CP.onExit cp case _ of
    Exit.Normally code → respond.onExit (code == 0)
    Exit.BySignal _ → respond.onExit false
  pure { kill: CP.kill SIGINT cp }
