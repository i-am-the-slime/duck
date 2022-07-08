module Story.Ctx.Types where

import Prelude

import Biz.IPC.Message.Types (MessageToMain, MessageToRenderer)
import Data.Maybe (Maybe)
import Effect (Effect)

type OnMessage =
  MessageToMain →
  Effect (Maybe MessageToRenderer)
