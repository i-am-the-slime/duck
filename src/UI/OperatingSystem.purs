module UI.OperatingSystem where

import Prelude

import Biz.OperatingSystem.Types (OperatingSystem(..))
import Data.String as String
import Effect (Effect)
import Web.HTML (Navigator, window)
import Web.HTML.Window (navigator)

foreign import getAppVersion ∷ Navigator → Effect String

getOS ∷ Effect OperatingSystem
getOS = ado
  raw ← window >>= navigator >>= getAppVersion
  let contains pat = String.contains (String.Pattern pat) raw
  in
    if contains "Win" then Windows else if contains "Mac" then MacOS else Linux
  where
  contains = String.contains
