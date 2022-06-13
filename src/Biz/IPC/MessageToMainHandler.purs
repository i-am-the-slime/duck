module Biz.IPC.MessageToMainHandler where

import Prelude

import Biz.IPC.Message.Types (MessageToMain(..))
import Biz.IPC.SelectFolder.Types (SelectedFolderData, invalidSpagoDhall, noSpagoDhall, nothingSelected, validSpagoDhall)
import Data.Array.NonEmpty as NEA
import Data.Either (either)
import Data.Maybe (Maybe(..))
import Debug (spy)
import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class (liftEffect)
import Electron (BrowserWindow, openDirectory, sendToWebContents, showOpenDialog)
import Electron.Types (Channel(..))
import Node.ChildProcess (defaultSpawnOptions)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (readTextFile)
import Node.FS.Sync (exists)
import Node.Path as Path
import ParseDhall (parseDhall2, parsePackagesDhall)
import Sunde (spawn)
import Yoga.JSON (readJSON)

handleMessageToMain :: BrowserWindow -> MessageToMain -> Effect Unit
handleMessageToMain window = case _ of
  ShowFolderSelector -> showFolderSelector window

showFolderSelector :: BrowserWindow -> Effect Unit
showFolderSelector window = launchAff_ do
  result <- window # showOpenDialog { properties: [ openDirectory ] }
  selectionResult :: SelectedFolderData <- case result of
    { canceled: false, filePaths } | Just paths <- NEA.fromArray filePaths ->
      do
        let spagoPath = Path.concat [ NEA.head paths, "spago.dhall" ]
        pathExistsʔ <- exists spagoPath # liftEffect
        let packagesPath = Path.concat [ NEA.head paths, "packages.dhall" ]
        path2Existsʔ <- exists packagesPath # liftEffect
        if not pathExistsʔ || not path2Existsʔ then pure noSpagoDhall
        else do
          spagoDhall <- readTextFile UTF8 spagoPath
          parsedʔ <- parseDhall2 spagoDhall
          packagesDhall <- readTextFile UTF8 packagesPath
          parsedPackagesʔ <- parsePackagesDhall packagesDhall
          -- let _ = spy "parsed" parsedʔ
          let _ = spy "parsed" parsedPackagesʔ
          { stdout: spagoJSON } <- spawn
            { cmd: "dhall-to-json"
            , args: []
            , stdin: Just spagoDhall
            }
            defaultSpawnOptions
          pure $ either invalidSpagoDhall validSpagoDhall
            (readJSON spagoJSON)
    _ -> pure nothingSelected

  sendToWebContents
    selectionResult
    (Channel "folder-selected")
    window
    # liftEffect