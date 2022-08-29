module Biz.IPC.MessageToMainHandler where

import Prelude

import Backend.CheckTools (getToolPath, getToolsWithPaths)
import Backend.PureScriptSolutionDefinition (readSolutionDefinition)
import Backend.Tool.Types (Tool(..))
import Biz.IPC.GetInstalledTools.Types (GetInstalledToolsResult(..))
import Biz.IPC.Message.Types (MessageToMain(..), MessageToRenderer(..), RunCommandUpdate(..))
import Biz.IPC.MessageToMainHandler.Github (getGithubDeviceCode, getIsLoggedIntoGithub, pollGithubAccessToken, queryGithubGraphQL)
import Biz.IPC.SelectFolder.Types (SelectedFolderData, invalidSpagoDhall, noSpagoDhall, nothingSelected, validSpagoDhall)
import Biz.OperatingSystem (operatingSystemʔ)
import Biz.Preferences (readAppPreferences)
import Biz.Spago.Service (getGlobalCacheDir)
import Biz.Tool (runToolAndGetStdout, runToolAndSendOutput)
import Control.Monad.Except (ExceptT(..), except, runExceptT)
import Data.Array.NonEmpty as NEA
import Data.Bifunctor (lmap)
import Data.Either (blush, either, note)
import Data.Map (Map)
import Data.Maybe (Maybe(..), maybe)
import Data.Traversable (for)
import Data.Tuple.Nested ((/\))
import Data.UUID (UUID)
import Data.UUID as UUID
import Effect.Aff (Aff, attempt, launchAff_)
import Effect.Class (liftEffect)
import Effect.Ref (Ref)
import Electron (BrowserWindow, copyToClipboard, getClipboardText, openDirectory, sendToWebContents)
import Electron as Electron
import Electron.Types (Channel(..))
import Node.ChildProcess (ChildProcess, defaultSpawnOptions)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (readTextFile)
import Node.FS.Aff as FSA
import Node.FS.Sync (exists)
import Node.Path as Path
import Sunde (spawn)
import Yoga.JSON (readJSON)

type Ctx = { pscIdeServers ∷ Ref (Map UUID ChildProcess) }

handleMessageToMain ∷
  -- Ctx →
  BrowserWindow →
  (UUID → MessageToMain → Aff Unit)
handleMessageToMain {-context-} window = \message_id message → do
  let
    respondWith { isPartial } response = liftEffect do
      let
        responsePayload =
          { response_for_message_id: UUID.toString message_id
          , response
          , isPartial
          }
      window # sendToWebContents responsePayload (Channel "ipc")
    respond = respondWith { isPartial: false }
  case message of
    LoadSpagoProject → loadSpagoProject window >>= respond
    ShowOpenDialog _ → showOpenDialog window >>= respond
    GetInstalledTools → getInstalledTools >>= respond
    GetPureScriptSolutionDefinitions → getProjectDefinitions >>= respond
    QueryGithubGraphQL arg → queryGithubGraphQL arg >>= respond
    GetIsLoggedIntoGithub → getIsLoggedIntoGithub >>= respond
    GithubLoginGetDeviceCode → getGithubDeviceCode >>= respond
    GithubPollAccessToken arg → pollGithubAccessToken arg >>= respond
    GetClipboardText →
      GetClipboardTextResult <$> getClipboardText # liftEffect >>= respond
    CopyToClipboard arg →
      (CopyToClipboardResult arg) <$ copyToClipboard arg # liftEffect >>=
        respond
    GetSpagoGlobalCache → getSpagoGlobalCache >>= respond
    RunCommand arg →
      -- runCommand respondWith arg
      runCommandLong respondWith arg
    StoreTextFile arg → storeTextFile arg >>= respond
    LoadTextFile arg → loadTextFile arg >>= respond
    StartPureScriptLanguageServer arg → startPureScriptLanguageServer arg >>=
      respond

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
  ({ isPartial ∷ Boolean } → MessageToRenderer → Aff Unit) →
  { args ∷ Array String, workingDir ∷ Maybe String, tool ∷ Tool } →
  Aff Unit
runCommand respondWith { tool, workingDir, args } =
  respondWith { isPartial: false } =<<
    RunCommandResult
      <$> runExceptT do
        os ← operatingSystemʔ # note "Unsupported OS" # except
        path ← getToolPath os tool <#> note "Tool is not installed" # ExceptT
        runToolAndGetStdout { args, toolPath: path, workingDir } # ExceptT

runCommandLong ∷
  ({ isPartial ∷ Boolean } → MessageToRenderer → Aff Unit) →
  { args ∷ Array String, workingDir ∷ Maybe String, tool ∷ Tool } →
  Aff Unit
runCommandLong respondWith { tool, workingDir, args } = do
  let
    r = RunCommandUpdateResult
    fail = respondWith { isPartial: false }
      (r $ CommandFinished false)
    partial = launchAff_ <<< respondWith { isPartial: true } <<< r
    done isSuccess = launchAff_ $ respondWith { isPartial: false }
      (r $ CommandFinished isSuccess)
  case operatingSystemʔ of
    Nothing → fail
    Just os → do
      toolPathʔ ← getToolPath os tool
      case toolPathʔ of
        Nothing → fail
        Just toolPath → liftEffect do
          _kill ← runToolAndSendOutput
            { onStdout: partial <<< StdoutData
            , onStderr: partial <<< StderrData
            , onExit: done
            }
            { args, toolPath, workingDir }
          pure unit

storeTextFile ∷ { content ∷ String, path ∷ String } → Aff MessageToRenderer
storeTextFile { path, content } = StoreTextFileResult <$> do
  res ← attempt $ FSA.writeTextFile UTF8 path content
  pure $ blush res <#> show

loadTextFile ∷ String → Aff MessageToRenderer
loadTextFile arg = LoadTextFileResult <$> do
  attempt (FSA.readTextFile UTF8 arg) <#> lmap show

startPureScriptLanguageServer ∷ { folder ∷ String } → Aff MessageToRenderer
startPureScriptLanguageServer { folder } = StartPureScriptLanguageServerResponse
  <$> (map (const {}))
  <$> runExceptT do
    os ← operatingSystemʔ # note "Unsupported OS" # except
    path ← getToolPath os PureScriptLanguageServer
      <#> note "PureScript language server is not installed"
      # ExceptT
    runToolAndGetStdout
      { args: [ "--node-ipc" ], toolPath: path, workingDir: Just folder } #
      ExceptT
