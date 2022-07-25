module Biz.OperatingSystem where

import Prelude

import Biz.OperatingSystem.Types (OperatingSystem)
import Biz.OperatingSystem.Types as OperatingSystem
import Data.Maybe (Maybe(..))
import Node.Platform as Platform
import Node.Process (platform)

operatingSystemʔ ∷ Maybe OperatingSystem
operatingSystemʔ = platform >>= case _ of
  Platform.Linux → Just OperatingSystem.Linux
  Platform.Darwin → Just OperatingSystem.MacOS
  Platform.Win32 → Just OperatingSystem.Windows
  _ → Nothing
