module Biz.IPC.Message.Types where

import Prelude

import Backend.Github.API.Types (GithubGraphQLQuery, GithubGraphQLResponse)
import Biz.Github.Types (DeviceCode, DeviceCodeResponse, DeviceTokenError)
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
import Yoga.JSON (class ReadForeign, class WriteForeign)
import Yoga.JSON.Generics (defaultOptions, genericReadForeignTaggedSum, genericWriteForeignTaggedSum)

data MessageToMain
  = ShowFolderSelector
  | ShowOpenDialog OpenDialog.Args
  | GetInstalledTools
  | GetPureScriptSolutionDefinitions
  | QueryGithubGraphQL { token ∷ GithubAccessToken, query ∷ GithubGraphQLQuery }
  | GetStoredGithubAccessToken
  | GithubLoginGetDeviceCode
  | GithubPollAccessToken DeviceCode

data MessageToRenderer
  = ShowFolderSelectorResponse SelectedFolderData
  | UserSelectedFile (Maybe FilePath)
  | GetInstalledToolsResponse GetInstalledToolsResult
  | GetPureScriptSolutionDefinitionsResponse
      (Array (Tuple FilePath PureScriptSolutionDefinition))
  | GetStoredGithubAccessTokenResult (Maybe GithubAccessToken)
  | GithubGraphQLResult GithubGraphQLResponse
  | GithubLoginGetDeviceCodeResult (FailedOr String DeviceCodeResponse)
  | GithubPollAccessTokenResult
      (FailedOr String (FailedOr DeviceTokenError GithubAccessToken))

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
