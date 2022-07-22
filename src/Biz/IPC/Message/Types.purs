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
  | RunCommand { tool ∷ Tool, args ∷ Array String }

data MessageToRenderer
  = LoadSpagoProjectResponse SelectedFolderData
  | UserSelectedFile (Maybe FilePath)
  | GetInstalledToolsResponse GetInstalledToolsResult
  | GetPureScriptSolutionDefinitionsResponse
      (Array (Tuple FilePath PureScriptSolutionDefinition))
  | GetIsLoggedIntoGithubResult Boolean
  | GithubGraphQLResult (FailedOr NoGithubToken GithubGraphQLResponse)
  | GithubLoginGetDeviceCodeResult (FailedOr String DeviceCodeResponse)
  | GithubPollAccessTokenResult
      (FailedOr String (FailedOr DeviceTokenError GithubAccessToken))
  | CopyToClipboardResult String
  | GetClipboardTextResult String
  | GetSpagoGlobalCacheResult (FailedOr String SpagoGlobalCacheDir)
  | RunCommandResult (Either String String)

data FailedOr e a = Failed e | Succeeded a

failedOrToEither ∷ ∀ e a. FailedOr e a → Either e a
failedOrToEither = case _ of
  Failed f → Left f
  Succeeded a → Right a

failedOrFromEither ∷ ∀ e a. Either e a → FailedOr e a
failedOrFromEither = case _ of
  Left f → Failed f
  Right a → Succeeded a

derive instance Generic (FailedOr e a) _
derive instance (Eq e, Eq a) ⇒ Eq (FailedOr e a)
derive instance (Ord e, Ord a) ⇒ Ord (FailedOr e a)
instance (WriteForeign e, WriteForeign a) ⇒ WriteForeign (FailedOr e a) where
  writeImpl = genericWriteForeignTaggedSum defaultOptions

instance (ReadForeign e, ReadForeign a) ⇒ ReadForeign (FailedOr e a) where
  readImpl = genericReadForeignTaggedSum defaultOptions

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
