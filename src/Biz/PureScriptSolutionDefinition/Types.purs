module Biz.PureScriptSolutionDefinition.Types where

import Prelude

import Data.Generic.Rep (class Generic)
import Data.Maybe (Maybe)
import Data.Show.Generic (genericShow)
import Data.String.Extra (kebabCase)
import Node.Path (FilePath)
import Yoga.JSON (class ReadForeign, class WriteForeign)
import Yoga.JSON.Generics (genericReadForeignEnum, genericReadForeignTaggedSum, genericWriteForeignEnum, genericWriteForeignTaggedSum)
import Yoga.JSON.Generics as GenericForeignTaggedSum

pureScriptSolutionFileName ∷ String
pureScriptSolutionFileName = ".purescript-solution.json"

type PureScriptSolutionDefinition =
  { name ∷ String
  , projects ∷ Array PureScriptProjectDefinition
  }

data PureScriptProjectDefinition
  = SpagoApp { | SpagoProjectInfo () }
  | SpagoLibrary { | SpagoProjectInfo () }

data EntryPointType = Test | Build

type Entrypoint =
  { spago_file ∷ FilePath
  , build_command ∷ Maybe String
  , type ∷ EntryPointType
  }

type SpagoProjectInfo r =
  ( root ∷ FilePath
  , entrypoints ∷ Array Entrypoint
  | r
  )

-- Boring instances
serialisationConfig ∷ GenericForeignTaggedSum.Options
serialisationConfig =
  { typeTag: "type"
  , valueTag: "definition"
  , toConstructorName: kebabCase
  }

derive instance Generic EntryPointType _
derive instance Eq EntryPointType
derive instance Ord EntryPointType
instance Show EntryPointType where
  show = genericShow

instance WriteForeign EntryPointType where
  writeImpl = genericWriteForeignEnum

instance ReadForeign EntryPointType where
  readImpl = genericReadForeignEnum

derive instance Generic PureScriptProjectDefinition _
derive instance Eq PureScriptProjectDefinition
derive instance Ord PureScriptProjectDefinition
instance Show PureScriptProjectDefinition where
  show = genericShow

instance WriteForeign PureScriptProjectDefinition where
  writeImpl = genericWriteForeignTaggedSum serialisationConfig

instance ReadForeign PureScriptProjectDefinition where
  readImpl = genericReadForeignTaggedSum serialisationConfig