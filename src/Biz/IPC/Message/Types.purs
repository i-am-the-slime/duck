module Biz.IPC.Message.Types where

import Prelude

import Biz.IPC.SelectFolder.Types (SelectedFolderData)
import Data.Bounded.Generic (genericBottom, genericTop)
import Data.Enum (class BoundedEnum, class Enum)
import Data.Enum.Generic (genericCardinality, genericFromEnum, genericPred, genericSucc, genericToEnum)
import Data.Generic.Rep (class Generic)
import Electron.Types (Channel(..))

data MessageToMain =
  ShowFolderSelector

data MessageToRenderer =
  ShowFolderSelectorResponse SelectedFolderData

messageToMainChannel :: MessageToMain -> Channel
messageToMainChannel = Channel <<< case _ of
  ShowFolderSelector -> "show-folder-selector"

messageToRendererChannel :: MessageToRenderer -> Channel
messageToRendererChannel = Channel <<< case _ of
  ShowFolderSelectorResponse _ -> "show-folder-selector-response"

derive instance Generic MessageToMain _
derive instance Eq MessageToMain
derive instance Ord MessageToMain

instance Enum MessageToMain where
  succ = genericSucc
  pred = genericPred

instance Bounded MessageToMain where
  top = genericTop
  bottom = genericBottom

instance BoundedEnum MessageToMain where
  cardinality = genericCardinality
  toEnum = genericToEnum
  fromEnum = genericFromEnum

derive instance Generic MessageToRenderer _
derive instance Eq MessageToRenderer
derive instance Ord MessageToRenderer