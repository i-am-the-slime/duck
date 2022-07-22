module Backend.Tool.Types where

import Prelude

import Data.Array as Array
import Data.Bounded.Generic (genericBottom, genericTop)
import Data.Enum (class BoundedEnum, class Enum)
import Data.Enum.Generic (genericCardinality, genericFromEnum, genericPred, genericSucc, genericToEnum)
import Data.Generic.Rep (class Generic)
import Data.Maybe (Maybe(..))
import Data.String.Extra (snakeCase)
import Data.Tuple.Nested (type (/\), (/\))
import Effect.Console as Console
import Effect.Unsafe (unsafePerformEffect)
import Foreign.Object as Object
import Type.Proxy (Proxy(..))
import Yoga.JSON (class ReadForeign, class WriteForeign)
import Yoga.JSON.Generics (genericReadForeignEnum, genericWriteForeignEnum)

type ToolWithPath = Tool /\ Maybe ToolPath

data Tool = NPM | Spago | Purs | DhallToJSON

type ToolsR r =
  { npm ∷ r
  , spago ∷ r
  , purs ∷ r
  , dhallToJSON ∷ r
  }

toToolArray ∷ ∀ r. ToolsR r → Array (Tool /\ r)
toToolArray = Object.fromHomogeneous >>> Object.toUnfoldable >>>
  Array.mapMaybe
    case _ of
      "npm" /\ v → Just (NPM /\ v)
      "spago" /\ v → Just (Spago /\ v)
      "purs" /\ v → Just (Purs /\ v)
      "dhallToJSON" /\ v → Just (DhallToJSON /\ v)
      huh /\ _ → unsafePerformEffect do
        Console.error ("Unhandled case in toToolArray: " <> huh)
        pure Nothing

proxies ∷
  { dhallToJSON ∷ Proxy "dhallToJSON"
  , npm ∷ Proxy "npm"
  , purs ∷ Proxy "purs"
  , spago ∷ Proxy "spago"
  }
proxies =
  { npm: Proxy ∷ _ "npm"
  , spago: Proxy ∷ _ "spago"
  , purs: Proxy ∷ _ "purs"
  , dhallToJSON: Proxy ∷ _ "dhallToJSON"
  }

toCommand ∷ Tool → String
toCommand = case _ of
  NPM → "npm"
  DhallToJSON → "dhall-to-json"
  Spago → "spago"
  Purs → "purs"

toName ∷ Tool → String
toName = case _ of
  NPM → "Node Package Manager"
  DhallToJSON → "Dhall to JSON"
  Spago → "Spago"
  Purs → "PureScript Compiler"

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

instance WriteForeign Tool where
  writeImpl = genericWriteForeignEnum { toConstructorName: snakeCase }

instance ReadForeign Tool where
  readImpl = genericReadForeignEnum { toConstructorName: snakeCase }

newtype ToolPath = ToolPath String

derive instance Eq ToolPath
derive instance Ord ToolPath
derive newtype instance ReadForeign ToolPath
derive newtype instance WriteForeign ToolPath
