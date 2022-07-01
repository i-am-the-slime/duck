-- [TODO]: Windows and Linux support
module Backend.CheckTools where

import Prelude

import Backend.OperatingSystem.Types (OperatingSystem(..))
import Backend.Tool.Types (Tool, ToolPath(..), ToolWithPath)
import Backend.Tool.Types as Tool
import Data.Enum (enumFromTo)
import Data.Maybe (Maybe(..))
import Data.String as String
import Data.Traversable (traverse)
import Data.Tuple.Nested ((/\))
import Effect.Aff (Aff)
import Node.ChildProcess (defaultSpawnOptions)
import Node.ChildProcess as CP
import Sunde (spawn)

getToolsWithPaths ∷ OperatingSystem → Aff (Array ToolWithPath)
getToolsWithPaths os = traverse getOS allTools
  where
  getOS tool = ado
    toolPathʔ ← which os tool
    in tool /\ toolPathʔ

  allTools = enumFromTo bottom top

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
