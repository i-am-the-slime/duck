module Main where

import Prelude

import Backend.IPC.Handler (registerAllHandlers)
import Backend.Protocol (registerProtocol)
import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class (liftEffect)
import Electron (BrowserWindowConfig, appendSwitch, loadFile, newBrowserWindow, openHttpsInBrowserAndBlockOtherURLs, setWindowOpenHandlerToExternal, showWhenReadyToShow, waitUntilAppReady)
import Node.Path (FilePath)
import Node.Path as Path

main ∷ Effect Unit
main = launchAff_ do
  waitUntilAppReady
  openHttpsInBrowserAndBlockOtherURLs # liftEffect
  appendSwitch "enable-features" "CSSContainerQueries" # liftEffect
  registerProtocol # liftEffect
  options ← mkOptions # liftEffect
  window ← newBrowserWindow options # liftEffect
  -- Set up inter-process communication
  window # registerAllHandlers # liftEffect
  window # showWhenReadyToShow # liftEffect
  window # loadFile "index.html"
  window # setWindowOpenHandlerToExternal # liftEffect

foreign import dirnameImpl ∷ Effect FilePath

mkOptions ∷ Effect BrowserWindowConfig
mkOptions = ado
  dirName ← dirnameImpl
  in
    { width: 800
    , height: 600
    , backgroundColor: "#000000"
    , show: false
    , webPreferences:
        { preload: Path.concat [ dirName, "preload.js" ]
        , nodeIntegration: false
        , enableRemoteModule: false
        , contextIsolation: true
        , sandbox: true
        }
    }