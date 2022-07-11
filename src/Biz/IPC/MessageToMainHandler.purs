module Biz.IPC.MessageToMainHandler where

import Prelude

import Backend.CheckTools (getToolsWithPaths)
import Backend.OperatingSystem (operatingSystemʔ)
import Backend.PureScriptSolutionDefinition (readSolutionDefinition)
import Backend.Tool.Types (Tool(..))
import Biz.IPC.GetInstalledTools.Types (GetInstalledToolsResult(..))
import Biz.IPC.Message.Types (MessageToMain(..), MessageToRenderer(..), failedOrFromEither)
import Biz.IPC.MessageToMainHandler.Github (getGithubDeviceCode, getIsLoggedIntoGithub, pollGithubAccessToken, queryGithubGraphQL)
import Biz.IPC.SelectFolder.Types (SelectedFolderData, invalidSpagoDhall, noSpagoDhall, nothingSelected, validSpagoDhall)
import Biz.Preferences (readAppPreferences)
import Biz.Spago.Service (getGlobalCacheDir)
import Control.Monad.Except (ExceptT(..), except, runExceptT)
import Data.Array as Array
import Data.Array.NonEmpty as NEA
import Data.Either (Either(..), either, note)
import Data.Maybe (Maybe(..), maybe)
import Data.Traversable (for)
import Data.Tuple (fst, snd)
import Data.Tuple.Nested ((/\))
import Data.UUID (UUID)
import Data.UUID as UUID
import Debug (spy)
import Effect.Aff (Aff)
import Effect.Class (liftEffect)
import Electron (BrowserWindow, copyToClipboard, getClipboardText, openDirectory, sendToWebContents)
import Electron as Electron
import Electron.Types (Channel(..))
import Node.ChildProcess (defaultSpawnOptions)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (readTextFile)
import Node.FS.Sync (exists)
import Node.Path as Path
import Sunde (spawn)
import Yoga.JSON (readJSON)
import Yoga.JSON as JSON

handleMessageToMain ∷
  BrowserWindow → (UUID → MessageToMain → Aff Unit)
handleMessageToMain window = \message_id message → do
  response ∷ MessageToRenderer ← case message of
    ShowFolderSelector → showFolderSelector window
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

getSpagoGlobalCache ∷ Aff MessageToRenderer
getSpagoGlobalCache = GetSpagoGlobalCacheResult <<< failedOrFromEither <$>
  runExceptT do
    os ← operatingSystemʔ # note "Unsupported OS" # except
    tools ← getToolsWithPaths os <#> Right # ExceptT
    spagoPath ← (Array.find (fst >>> (_ == Spago)) tools >>= snd)
      # note "Spago is not installed"
      # except
    getGlobalCacheDir spagoPath # ExceptT