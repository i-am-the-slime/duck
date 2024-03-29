module Biz.IPC.SelectFolder.Types where

import Prelude

import Data.List (intercalate)
import Data.Variant (Variant, inj)
import Foreign (MultipleErrors, renderForeignError)
import Spago.SpagoDhall.Types (SpagoDhall)
import Type.Proxy (Proxy(..))
import Type.Row (type (+))

type SelectFolderData = {}

type SelectedFolderData = Variant
  ( NothingSelected
      + NoSpagoDhall
      + InvalidSpagoDhall
      + ValidSpagoDhall ()
  )

-- | nothingSelected
nothingSelected ∷ ∀ r. Variant (NothingSelected r)
nothingSelected = inj nothingSelectedKey {}

nothingSelectedKey ∷ Proxy "nothingSelected"
nothingSelectedKey = Proxy

type NothingSelected others = (nothingSelected ∷ {} | others)

-- | noSpagoDhall
noSpagoDhall ∷ ∀ r. Variant (NoSpagoDhall r)
noSpagoDhall = inj noSpagoDhallKey {}

noSpagoDhallKey ∷ Proxy "noSpagoDhall"
noSpagoDhallKey = Proxy

type NoSpagoDhall others = (noSpagoDhall ∷ {} | others)

-- | invalidSpagoDhall
invalidSpagoDhall ∷ ∀ r. MultipleErrors → Variant (InvalidSpagoDhall r)
invalidSpagoDhall errs = inj invalidSpagoDhallKey
  (intercalate "\n" (renderForeignError <$> errs))

invalidSpagoDhallKey ∷ Proxy "invalidSpagoDhall"
invalidSpagoDhallKey = Proxy

type InvalidSpagoDhall others = (invalidSpagoDhall ∷ String | others)

-- | validSpagoDhall
validSpagoDhall ∷ ∀ r. SpagoDhall → Variant (ValidSpagoDhall r)
validSpagoDhall = inj validSpagoDhallKey

validSpagoDhallKey ∷ Proxy "validSpagoDhall"
validSpagoDhallKey = Proxy

type ValidSpagoDhall others =
  (validSpagoDhall ∷ SpagoDhall | others)
