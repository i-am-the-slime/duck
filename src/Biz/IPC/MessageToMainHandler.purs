module Biz.IPC.MessageToMainHandler where

import Prelude

import Backend.CheckTools (getToolsWithPaths)
import Backend.OperatingSystem (operatingSystemʔ)
import Backend.PureScriptSolutionDefinition (readSolutionDefinition)
import Biz.IPC.GetInstalledTools.Types (GetInstalledToolsResult(..))
import Biz.IPC.Message.Types (MessageToMain(..), MessageToRenderer(..))
import Biz.IPC.MessageToMainHandler.Github (getGithubDeviceCode, getStoredGithubAccessToken, pollGithubAccessToken, queryGithubGraphQL)
import Biz.IPC.SelectFolder.Types (SelectedFolderData, invalidSpagoDhall, noSpagoDhall, nothingSelected, validSpagoDhall)
import Biz.Preferences (readAppPreferences)
import Data.Array.NonEmpty as NEA
import Data.Either (either)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), maybe)
import Data.Traversable (for)
import Data.Tuple.Nested ((/\))
import Effect.Aff (Aff)
import Effect.Class (liftEffect)
import Electron (BrowserWindow, openDirectory, sendToWebContents)
import Electron as Electron
import Electron.Types (Channel(..))
import Node.ChildProcess (defaultSpawnOptions)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (readTextFile)
import Node.FS.Sync (exists)
import Node.Path as Path
import Sunde (spawn)
import Yoga.JSON (readJSON)

handleMessageToMain ∷
  BrowserWindow → (MessageToMain → Aff Unit)
handleMessageToMain window = \message → do
  responseʔ ∷ Maybe MessageToRenderer ← case message of
    ShowFolderSelector → Just <$> showFolderSelector window
    ShowOpenDialog _ → Just <$> showOpenDialog window
    GetInstalledTools → Just <$> getInstalledTools
    GetPureScriptSolutionDefinitions →
      Just <$> getProjectDefinitions
    QueryGithubGraphQL arg → Just <$> queryGithubGraphQL arg
    GetStoredGithubAccessToken → Just <$> getStoredGithubAccessToken
    GithubLoginGetDeviceCode → Just <$> getGithubDeviceCode
    GithubPollAccessToken arg → Just <$> pollGithubAccessToken arg

  liftEffect $ for_ responseʔ \(response ∷ MessageToRenderer) →
    window # sendToWebContents response (Channel "ipc")

getInstalledTools ∷ Aff MessageToRenderer
getInstalledTools =
  GetInstalledToolsResponse <$> do
    operatingSystemʔ <#> getToolsWithPaths
      # maybe (pure UnsupportedOperatingSystem) (map ToolsResult)

showOpenDialog ∷ BrowserWindow → Aff MessageToRenderer
showOpenDialog window = do
  result ← window # Electron.showOpenDialog { properties: [ openDirectory ] }
  UserSelectedFile <$>
    case result of
      { canceled: false, filePaths } | [ path ] ← filePaths → do
        Just <$> readTextFile UTF8 path
      _ → pure Nothing

showFolderSelector ∷ BrowserWindow → Aff MessageToRenderer
showFolderSelector window = do
  result ← window # Electron.showOpenDialog { properties: [ openDirectory ] }
  selectionResult ∷ SelectedFolderData ← case result of
    { canceled: false, filePaths } | Just paths ← NEA.fromArray filePaths →
      do
        let spagoPath = Path.concat [ NEA.head paths, "spago.dhall" ]
        pathExistsʔ ← exists spagoPath # liftEffect
        let packagesPath = Path.concat [ NEA.head paths, "packages.dhall" ]
        path2Existsʔ ← exists packagesPath # liftEffect
        if not pathExistsʔ || not path2Existsʔ then pure noSpagoDhall
        else do
          spagoDhall ← readTextFile UTF8 spagoPath
          -- parsedʔ ← parseDhall2 spagoDhall
          -- packagesDhall ← readTextFile UTF8 packagesPath
          -- parsedPackagesʔ <- parsePackagesDhall packagesDhall
          -- let _ = spy "parsed" parsedʔ
          -- let _ = spy "parsed" parsedPackagesʔ
          { stdout: spagoJSON } ← spawn
            { cmd: "dhall-to-json"
            , args: []
            , stdin: Just spagoDhall
            }
            defaultSpawnOptions
          pure $ either invalidSpagoDhall validSpagoDhall (readJSON spagoJSON)
    _ → pure nothingSelected
  pure $ ShowFolderSelectorResponse selectionResult

getProjectDefinitions ∷ Aff MessageToRenderer
getProjectDefinitions = do
  prefs ← readAppPreferences
  projects ← for prefs.solutions \fp → (fp /\ _) <$> readSolutionDefinition fp
  pure $ GetPureScriptSolutionDefinitionsResponse projects