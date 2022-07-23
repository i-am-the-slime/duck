module Biz.IPC.Message.Types where

import Prelude

import Backend.Github.API.Types (GithubGraphQLQuery, GithubGraphQLResponse)
import Backend.Tool.Spago.Types (SpagoGlobalCacheDir)
import Backend.Tool.Types (Tool)
import Biz.Github.Auth.Types (DeviceCode, DeviceCodeResponse, DeviceTokenError)
import Biz.IPC.GetInstalledTools.Types (GetInstalledToolsResult)
import Biz.IPC.Message.OpenDialog.Types as OpenDialog
import Biz.IPC.SelectFolder.Types (SelectedFolderData)
import Biz.OAuth.Types (GithubAccessToken)
import Biz.PureScriptSolutionDefinition.Types (PureScriptSolutionDefinition)
import Data.Either (Either(..))
import Data.Generic.Rep (class Generic)
import Data.Maybe (Maybe)
import Data.Tuple (Tuple)
import Node.Path (FilePath)
import Yoga.JSON (class ReadForeign, class WriteForeign, writeImpl)
import Yoga.JSON.Generics (defaultOptions, genericReadForeignTaggedSum, genericWriteForeignTaggedSum)

data MessageToMain
  = LoadSpagoProject
  | ShowOpenDialog OpenDialog.Args
  | GetInstalledTools
  | GetPureScriptSolutionDefinitions
  | GetIsLoggedIntoGithub
  | QueryGithubGraphQL GithubGraphQLQuery
  | GithubLoginGetDeviceCode
  | GithubPollAccessToken DeviceCode
  | CopyToClipboard String
  | GetClipboardText
  | GetSpagoGlobalCache
  | RunCommand { tool ∷ Tool, workingDir ∷ Maybe String, args ∷ Array String }
  | StoreTextFile { path ∷ String, content ∷ String }
  | LoadTextFile String

data MessageToRenderer
  = LoadSpagoProjectResponse SelectedFolderData
  | UserSelectedFile (Maybe FilePath)
  | GetInstalledToolsResponse GetInstalledToolsResult
  | GetPureScriptSolutionDefinitionsResponse
      (Array (Tuple FilePath PureScriptSolutionDefinition))
  | GetIsLoggedIntoGithubResult Boolean
  | GithubGraphQLResult (Either NoGithubToken GithubGraphQLResponse)
  | GithubLoginGetDeviceCodeResult (Either String DeviceCodeResponse)
  | GithubPollAccessTokenResult
      (Either String (Either DeviceTokenError GithubAccessToken))
  | CopyToClipboardResult String
  | GetClipboardTextResult String
  | GetSpagoGlobalCacheResult (Either String SpagoGlobalCacheDir)
  | RunCommandResult (Either String String)
  | StoreTextFileResult (Maybe String)
  | LoadTextFileResult (Either String String)

derive instance Generic MessageToMain _
derive instance Eq MessageToMain
derive instance Ord MessageToMain

instance WriteForeign MessageToMain where
  writeImpl = genericWriteForeignTaggedSum defaultOptions

instance ReadForeign MessageToMain where
  readImpl = genericReadForeignTaggedSum defaultOptions

instance WriteForeign MessageToRenderer where
  writeImpl = genericWriteForeignTaggedSum defaultOptions

derive instance Generic MessageToRenderer _
derive instance Eq MessageToRenderer
derive instance Ord MessageToRenderer

instance ReadForeign MessageToRenderer where
  readImpl = genericReadForeignTaggedSum defaultOptions

data NoGithubToken = NoGithubToken

derive instance Generic NoGithubToken _
derive instance Eq NoGithubToken
derive instance Ord NoGithubToken
instance WriteForeign NoGithubToken where
  writeImpl _ = writeImpl "no_github_token"

instance ReadForeign NoGithubToken where
  readImpl = pure $ pure NoGithubToken
