module Main where

import Prelude

import Backend.IPC.Handler (registerAllHandlers)
import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class (liftEffect)
import Electron (BrowserWindowConfig, loadFile, newBrowserWindow, waitUntilAppReady)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (writeTextFile)
import Node.Path (FilePath)
import Node.Path as Path
import React.Basic.DOM.Server (renderToString)
import Renderer (mkEntryView)

main :: Effect Unit
main = launchAff_ do
  waitUntilAppReady
  options <- mkOptions # liftEffect
  window <- newBrowserWindow options # liftEffect
  -- Set up inter-process communication
  registerAllHandlers window # liftEffect
  reactHTMLString <- mkEntryView <#> renderToString # liftEffect
  let indexHTML = mkIndexHTML reactHTMLString
  writeTextFile UTF8 "index.html" indexHTML
  window # loadFile "index.html"

mkIndexHTML :: String -> String
mkIndexHTML content =
  """<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Hello World!</title>
  <link href="https://rsms.me/inter/inter.css" rel="stylesheet">
  <link href="http://fonts.cdnfonts.com/css/jetbrains-mono" rel="stylesheet">
</head>

<body>
  <div id="content">""" <> content <>
    """</div>
  <script src="./renderer.js"></script>
</body>

</html>
"""

foreign import dirnameImpl :: Effect FilePath

mkOptions :: Effect BrowserWindowConfig
mkOptions = ado
  dirName <- dirnameImpl
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