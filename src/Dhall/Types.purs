module Dhall.Types where

import Prelude

import Data.Generic.Rep (class Generic)
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype)
import Data.Show.Generic (genericShow)
import Foreign.Object (Object)
import Yoga.JSON (class ReadForeign, class WriteForeign)

data DhallLiteral
  = DhallString String
  | DhallBoolean Boolean
  | DhallLocalImport LocalImport
  | DhallRemoteImport RemoteImport
  | DhallArray (Array DhallLiteral)
  | DhallRecord (Object DhallLiteral)

derive instance Eq DhallLiteral
derive instance Generic DhallLiteral _

instance Show DhallLiteral where
  show x = genericShow x

data DhallExpression
  = LiteralExpr DhallLiteral
  | VariableExpr String
  | LetInExpr LetInBinding
  | InfixOperatorExpr InfixOperator DhallExpression DhallExpression

derive instance Eq DhallExpression
derive instance Generic DhallExpression _

type LetInBinding =
  { name ∷ String
  , value ∷ DhallLiteral
  , with ∷ Array { name ∷ String, value ∷ DhallLiteral }
  }

instance Show DhallExpression where
  show x = genericShow x

newtype LocalImport = LocalImport String

derive instance Newtype LocalImport _
derive instance Eq LocalImport
derive instance Ord LocalImport
derive newtype instance Show LocalImport
derive newtype instance WriteForeign LocalImport
derive newtype instance ReadForeign LocalImport

newtype RemoteImport = RemoteImport { url ∷ String, hash ∷ Maybe String }

derive instance Newtype RemoteImport _
derive instance Eq RemoteImport
derive instance Ord RemoteImport
derive newtype instance Show RemoteImport
derive newtype instance WriteForeign RemoteImport
derive newtype instance ReadForeign RemoteImport

data InfixOperator = InfixWith | InfixRecordMerge | ArrayMerge

derive instance Generic InfixOperator _
derive instance Eq InfixOperator
derive instance Ord InfixOperator
instance Show InfixOperator where
  show op = genericShow op
