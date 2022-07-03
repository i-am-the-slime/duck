module Biz.IPC.Message.Types where

import Prelude

import Backend.Github.API.Types (GithubGraphQLQuery(..), GithubGraphQLResponse)
import Biz.IPC.GetInstalledTools.Types (GetInstalledToolsResult)
import Biz.IPC.Message.OpenDialog.Types as OpenDialog
import Biz.IPC.SelectFolder.Types (SelectedFolderData)
import Biz.OAuth.Types (GithubAccessToken)
import Biz.PureScriptSolutionDefinition.Types (PureScriptSolutionDefinition)
import Data.Bounded.Generic (genericBottom, genericTop)
import Data.Enum (class BoundedEnum, class Enum)
import Data.Enum.Generic (genericCardinality, genericFromEnum, genericPred, genericSucc, genericToEnum)
import Data.Generic.Rep (class Generic)
import Data.Maybe (Maybe)
import Data.Tuple (Tuple)
import Electron.Types (Channel(..))
import Node.Path (FilePath)
import Yoga.JSON (class ReadForeign, class WriteForeign)
import Yoga.JSON.Generics (defaultOptions, genericReadForeignTaggedSum, genericWriteForeignTaggedSum)

data MessageToMain
  = ShowFolderSelector
  | ShowOpenDialog OpenDialog.Args
  | GetInstalledTools
  | GetPureScriptSolutionDefinitions
  | QueryGithubGraphQL { token ∷ GithubAccessToken, query ∷ GithubGraphQLQuery }

data MessageToRenderer
  = ShowFolderSelectorResponse SelectedFolderData
  | UserSelectedFile (Maybe FilePath)
  | GetInstalledToolsResponse GetInstalledToolsResult
  | GetPureScriptSolutionDefinitionsResponse
      (Array (Tuple FilePath PureScriptSolutionDefinition))
  | GithubGraphQLResult GithubGraphQLResponse

rendererToMainChannelName ∷ RendererToMainChannel → Channel
rendererToMainChannelName = Channel <<< case _ of
  ShowFolderSelectorChannel → "show-folder-selector"
  ShowOpenDialogChannel → "ask-user-to-select-folder"
  GetInstalledToolsChannel → "get-installed-tools"
  GetPureScriptSolutionDefinitionsChannel → "get-app-settings"
  QueryGithubGraphQLChannel → "query-github-graphql"

mainToRendererChannelName ∷ MainToRendererChannel → Channel
mainToRendererChannelName = Channel <<< case _ of
  ShowFolderSelectorResponseChannel → "show-folder-selector-response"
  ShowOpenDialogResponseChannel → "ask-user-to-select-folder-response"
  GetInstalledToolsResponseChannel → "get-installed-tools-response"
  GetPureScriptSolutionDefinitionsResponseChannel → "get-app-settings-response"
  GithubGraphQLResultChannel → "query-github-graphql-response"

messageToRendererToChannel ∷ MessageToRenderer → MainToRendererChannel
messageToRendererToChannel = case _ of
  ShowFolderSelectorResponse _ → ShowFolderSelectorResponseChannel
  UserSelectedFile _ → ShowOpenDialogResponseChannel
  GetInstalledToolsResponse _ → GetInstalledToolsResponseChannel
  GetPureScriptSolutionDefinitionsResponse _ → GetInstalledToolsResponseChannel
  GithubGraphQLResult _ → GithubGraphQLResultChannel

data RendererToMainChannel
  = ShowFolderSelectorChannel
  | ShowOpenDialogChannel
  | GetInstalledToolsChannel
  | GetPureScriptSolutionDefinitionsChannel
  | QueryGithubGraphQLChannel

data MainToRendererChannel
  = ShowFolderSelectorResponseChannel
  | ShowOpenDialogResponseChannel
  | GetInstalledToolsResponseChannel
  | GetPureScriptSolutionDefinitionsResponseChannel
  | GithubGraphQLResultChannel

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

derive instance Generic MainToRendererChannel _
derive instance Eq MainToRendererChannel
derive instance Ord MainToRendererChannel
instance Enum MainToRendererChannel where
  succ = genericSucc
  pred = genericPred

instance Bounded MainToRendererChannel where
  top = genericTop
  bottom = genericBottom

instance BoundedEnum MainToRendererChannel where
  cardinality = genericCardinality
  toEnum = genericToEnum
  fromEnum = genericFromEnum

derive instance Generic RendererToMainChannel _
derive instance Eq RendererToMainChannel
derive instance Ord RendererToMainChannel
instance Enum RendererToMainChannel where
  succ = genericSucc
  pred = genericPred

instance Bounded RendererToMainChannel where
  top = genericTop
  bottom = genericBottom

instance BoundedEnum RendererToMainChannel where
  cardinality = genericCardinality
  toEnum = genericToEnum
  fromEnum = genericFromEnum