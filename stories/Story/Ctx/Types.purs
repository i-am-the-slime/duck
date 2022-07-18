module Story.Ctx.Types where

import Biz.IPC.Message.Types (MessageToMain, MessageToRenderer)
import Data.Maybe (Maybe)
import Effect (Effect)

type OnMessage =
  MessageToMain →
  Effect (Maybe MessageToRenderer)
