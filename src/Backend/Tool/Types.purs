module Backend.Tool.Types where

import Prelude

import Backend.OperatingSystem.Types (OperatingSystem)
import Data.Bounded.Generic (genericBottom, genericTop)
import Data.Enum (class BoundedEnum, class Enum)
import Data.Enum.Generic (genericCardinality, genericFromEnum, genericPred, genericSucc, genericToEnum)
import Data.Generic.Rep (class Generic)
import Data.Maybe (Maybe)
import Data.Tuple.Nested (type (/\))

type ToolWithPath = Tool /\ Maybe ToolPath

data Tool = NPM | Spago | Purs | DhallToJSON

toCommand :: OperatingSystem -> Tool -> String
toCommand = case _, _ of
  _, NPM -> "npm"
  _, DhallToJSON -> "dhall-to-json"
  _, Spago -> "spago"
  _, Purs -> "purs"

toName :: Tool -> String
toName = case _ of
  NPM -> "Node Package Manager"
  DhallToJSON -> "Dhall to JSON"
  Spago -> "Spago"
  Purs -> "PureScript Compiler"

derive instance Generic Tool _
derive instance Eq Tool
derive instance Ord Tool

instance Enum Tool where
  succ = genericSucc
  pred = genericPred

instance Bounded Tool where
  top = genericTop
  bottom = genericBottom

instance BoundedEnum Tool where
  cardinality = genericCardinality
  toEnum = genericToEnum
  fromEnum = genericFromEnum

newtype ToolPath = ToolPath String