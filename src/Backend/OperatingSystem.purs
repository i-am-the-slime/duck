module Backend.OperatingSystem where

import Prelude

import Backend.OperatingSystem.Types (OperatingSystem)
import Backend.OperatingSystem.Types as OperatingSystem
import Data.Maybe (Maybe(..))
import Node.Platform as Platform
import Node.Process (platform)

operatingSystemʔ ∷ Maybe OperatingSystem
operatingSystemʔ = platform >>= case _ of
  Platform.Linux → Just OperatingSystem.Linux
  Platform.Darwin → Just OperatingSystem.MacOS
  Platform.Win32 → Just OperatingSystem.Windows
  _ → Nothing
