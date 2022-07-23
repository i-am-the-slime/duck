module Biz.IPC.MessageToMainHandler where

import Prelude

import Backend.CheckTools (getToolPath, getToolsWithPaths)
import Backend.OperatingSystem (operatingSystemʔ)
import Backend.PureScriptSolutionDefinition (readSolutionDefinition)
import Backend.Tool.Types (Tool(..))
import Biz.IPC.GetInstalledTools.Types (GetInstalledToolsResult(..))
import Biz.IPC.Message.Types (MessageToMain(..), MessageToRenderer(..))
import Biz.IPC.MessageToMainHandler.Github (getGithubDeviceCode, getIsLoggedIntoGithub, pollGithubAccessToken, queryGithubGraphQL)
import Biz.IPC.SelectFolder.Types (SelectedFolderData, invalidSpagoDhall, noSpagoDhall, nothingSelected, validSpagoDhall)
import Biz.Preferences (readAppPreferences)
import Biz.Spago.Service (getGlobalCacheDir)
import Biz.Tool (runToolAndGetStdout)
import Control.Monad.Except (ExceptT(..), except, runExceptT)
import Data.Array.NonEmpty as NEA
import Data.Bifunctor (lmap)
import Data.Either (blush, either, note)
import Data.Maybe (Maybe(..), maybe)
import Data.Traversable (for)
import Data.Tuple.Nested ((/\))
import Data.UUID (UUID)
import Data.UUID as UUID
import Effect.Aff (Aff, attempt)
import Effect.Class (liftEffect)
import Electron (BrowserWindow, copyToClipboard, getClipboardText, openDirectory, sendToWebContents)
import Electron as Electron
import Electron.Types (Channel(..))
import Node.ChildProcess (defaultSpawnOptions)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (readTextFile)
import Node.FS.Aff as FSA
import Node.FS.Sync (exists)
import Node.Path as Path
import Sunde (spawn)
import Yoga.JSON (readJSON)

handleMessageToMain ∷
  BrowserWindow → (UUID → MessageToMain → Aff Unit)
handleMessageToMain window = \message_id message → do
  response ∷ MessageToRenderer ← case message of
    LoadSpagoProject → loadSpagoProject window
    ShowOpenDialog _ → showOpenDialog window
    GetInstalledTools → getInstalledTools
    GetPureScriptSolutionDefinitions → getProjectDefinitions
    QueryGithubGraphQL arg → queryGithubGraphQL arg
    GetIsLoggedIntoGithub → getIsLoggedIntoGithub
    GithubLoginGetDeviceCode → getGithubDeviceCode
    GithubPollAccessToken arg → pollGithubAccessToken arg
    GetClipboardText →
      GetClipboardTextResult <$> getClipboardText # liftEffect
    CopyToClipboard arg →
      (CopyToClipboardResult arg) <$ copyToClipboard arg # liftEffect
    GetSpagoGlobalCache → getSpagoGlobalCache
    RunCommand arg → runCommand arg
    StoreTextFile arg → storeTextFile arg
    LoadTextFile arg → loadTextFile arg

  liftEffect do
    let
      responsePayload =
        { response_for_message_id: UUID.toString message_id
        , response
        }
    -- let _ = spy "Responding with" (JSON.write responsePayload)
    window # sendToWebContents responsePayload (Channel "ipc")

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

loadSpagoProject ∷ BrowserWindow → Aff MessageToRenderer
loadSpagoProject window = do
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
  pure $ LoadSpagoProjectResponse selectionResult

getProjectDefinitions ∷ Aff MessageToRenderer
getProjectDefinitions = do
  prefs ← readAppPreferences
  projects ← for prefs.solutions \fp → (fp /\ _) <$> readSolutionDefinition fp
  pure $ GetPureScriptSolutionDefinitionsResponse projects

getSpagoGlobalCache ∷ Aff MessageToRenderer
getSpagoGlobalCache = GetSpagoGlobalCacheResult <$>
  runExceptT do
    os ← operatingSystemʔ # note "Unsupported OS" # except
    path ← getToolPath os Spago <#> note "Spago is not installed" # ExceptT
    getGlobalCacheDir path # ExceptT

runCommand ∷
  { args ∷ Array String, workingDir ∷ Maybe String, tool ∷ Tool } →
  Aff MessageToRenderer
runCommand { tool, workingDir, args } = RunCommandResult <$> runExceptT do
  os ← operatingSystemʔ # note "Unsupported OS" # except
  path ← getToolPath os tool <#> note "Tool is not installed" # ExceptT
  runToolAndGetStdout { args, toolPath: path, workingDir } # ExceptT

storeTextFile ∷ { content ∷ String, path ∷ String } → Aff MessageToRenderer
storeTextFile { path, content } = StoreTextFileResult <$> do
  res ← attempt $ FSA.writeTextFile UTF8 path content
  pure $ blush res <#> show

loadTextFile ∷ String → Aff MessageToRenderer
loadTextFile arg = LoadTextFileResult <$> do
  attempt (FSA.readTextFile UTF8 arg) <#> lmap show
