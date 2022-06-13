module Biz.IPC.SelectFolder.Types where

import Prelude

import Biz.Spago.Types (ProjectConfig)
import Data.List (intercalate)
import Data.Variant (Variant, inj)
import Electron.Types (Channel(..))
import Foreign (MultipleErrors, renderForeignError)
import Type.Proxy (Proxy(..))
import Type.Row (type (+))

selectFolderChannel :: Channel
selectFolderChannel = Channel "select-folder"

type SelectFolderData = {}

selectedFolderChannel :: Channel
selectedFolderChannel = Channel "selected-folder"

type SelectedFolderData = Variant
  ( NothingSelected
      + NoSpagoDhall
      + InvalidSpagoDhall
      + ValidSpagoDhall ()
  )

-- | nothingSelected
nothingSelected :: forall r. Variant (NothingSelected r)
nothingSelected = inj nothingSelectedKey {}

nothingSelectedKey :: Proxy "nothingSelected"
nothingSelectedKey = Proxy

type NothingSelected others = (nothingSelected :: {} | others)

-- | noSpagoDhall
noSpagoDhall :: forall r. Variant (NoSpagoDhall r)
noSpagoDhall = inj noSpagoDhallKey {}

noSpagoDhallKey :: Proxy "noSpagoDhall"
noSpagoDhallKey = Proxy

type NoSpagoDhall others = (noSpagoDhall :: {} | others)

-- | invalidSpagoDhall
invalidSpagoDhall :: forall r. MultipleErrors -> Variant (InvalidSpagoDhall r)
invalidSpagoDhall errs = inj invalidSpagoDhallKey
  (intercalate "\n" (renderForeignError <$> errs))

invalidSpagoDhallKey :: Proxy "invalidSpagoDhall"
invalidSpagoDhallKey = Proxy

type InvalidSpagoDhall others = (invalidSpagoDhall :: String | others)

-- | validSpagoDhall
validSpagoDhall :: forall r. ProjectConfig -> Variant (ValidSpagoDhall r)
validSpagoDhall = inj validSpagoDhallKey

validSpagoDhallKey :: Proxy "validSpagoDhall"
validSpagoDhallKey = Proxy

type ValidSpagoDhall others = (validSpagoDhall :: ProjectConfig | others)