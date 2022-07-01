module Biz.IPC.Message.OpenDialog.Types where

import Data.Maybe (Maybe)

type Args =
  { directory ∷ Boolean
  , filters ∷
      Array
        { name ∷ Maybe String
        , extensions ∷ Maybe (Array String)
        }
  }