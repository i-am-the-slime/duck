module Main where

import Prelude

import Backend.IPC.Handler (registerAllHandlers)
import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class (liftEffect)
import Electron (BrowserWindowConfig, loadFile, newBrowserWindow, setWindowOpenHandlerToExternal, waitUntilAppReady)
import Node.Path (FilePath)
import Node.Path as Path

main ∷ Effect Unit
main = launchAff_ do
  waitUntilAppReady
  -- registerProtocol # liftEffect
  options ← mkOptions # liftEffect
  window ← newBrowserWindow options # liftEffect
  window # setWindowOpenHandlerToExternal # liftEffect
  -- Set up inter-process communication
  window # registerAllHandlers # liftEffect
  window # loadFile "index.html"

foreign import dirnameImpl ∷ Effect FilePath

mkOptions ∷ Effect BrowserWindowConfig
mkOptions = ado
  dirName ← dirnameImpl
  in
    { width: 800
    , height: 600
    , webPreferences:
        { preload: Path.concat [ dirName, "preload.js" ]
        , nodeIntegration: false
        , enableRemoteModule: false
        , contextIsolation: true
        , sandbox: true
        }
    }