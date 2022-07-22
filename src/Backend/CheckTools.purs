-- [TODO]: Windows and Linux support
module Backend.CheckTools where

import Prelude

import Backend.OperatingSystem.Types (OperatingSystem(..))
import Backend.Tool.Types (Tool(..), ToolPath(..), ToolsR)
import Backend.Tool.Types as Tool
import Data.Maybe (Maybe(..))
import Data.String as String
import Effect.Aff (Aff)
import Node.ChildProcess (defaultSpawnOptions)
import Node.ChildProcess as CP
import Record.Extra (sequenceRecord)
import Sunde (spawn)

type ToolsWithPath = ToolsR (Maybe ToolPath)

getToolsWithPaths ∷ OperatingSystem → Aff ToolsWithPath
getToolsWithPaths os = sequenceRecord
  { npm: getToolPath os NPM
  , spago: getToolPath os Spago
  , purs: getToolPath os Purs
  , dhallToJSON: getToolPath os DhallToJSON
  }

getToolPath ∷ OperatingSystem → Tool → Aff (Maybe ToolPath)
getToolPath os tool = ado
  toolPathʔ ← which os tool
  in toolPathʔ

which ∷ OperatingSystem → Tool → Aff (Maybe ToolPath)
which os tool = ado
  { stdout, exit } ← spawnCmd
  in
    case exit of
      CP.Normally 0 → Just (ToolPath (String.trim stdout))
      _ → Nothing
  where

  arg = Tool.toCommand tool

  spawnCmd = spawn { cmd, args: [ arg ], stdin: Nothing } defaultSpawnOptions

  cmd = case os of
    Windows → "where.exe"
    Linux → "which"
    MacOS → "which"
