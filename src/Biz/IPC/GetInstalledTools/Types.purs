module Biz.IPC.GetInstalledTools.Types where

import Prelude
import Backend.Tool.Types (ToolWithPath)
import Data.Generic.Rep (class Generic)
import Yoga.JSON (class ReadForeign, class WriteForeign)
import Yoga.JSON.Generics (genericReadForeignTaggedSum, genericWriteForeignTaggedSum)
import Yoga.JSON.Generics as TaggedSum

data GetInstalledToolsResult
  = UnsupportedOperatingSystem
  | ToolsResult (Array ToolWithPath)

derive instance Generic GetInstalledToolsResult _
derive instance Eq GetInstalledToolsResult
derive instance Ord GetInstalledToolsResult
instance WriteForeign GetInstalledToolsResult where
  writeImpl = genericWriteForeignTaggedSum TaggedSum.defaultOptions

instance ReadForeign GetInstalledToolsResult where
  readImpl = genericReadForeignTaggedSum TaggedSum.defaultOptions
