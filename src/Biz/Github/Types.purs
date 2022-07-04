module Biz.Github.Types where

import Prelude

import Biz.OAuth.Types (ClientID)
import Data.Array (intercalate)
import Data.Newtype (class Newtype, un, unwrap)
import Data.Time.Duration (Seconds(..))
import Yoga.JSON (class ReadForeign, class WriteForeign, readImpl, writeImpl)

newtype PersonalAccessToken = PersonalAccessToken String

derive newtype instance WriteForeign PersonalAccessToken
derive newtype instance ReadForeign PersonalAccessToken

newtype DeviceCodeRequest = DeviceCodeRequest
  { client_id ∷ ClientID
  , scope ∷ Array String
  }

instance WriteForeign DeviceCodeRequest where
  writeImpl (DeviceCodeRequest dcr) = writeImpl
    (dcr { scope = intercalate " " dcr.scope })

newtype DeviceCodeResponse = DeviceCodeResponse
  { device_code ∷ DeviceCode
  , expires_in ∷ Seconds
  , interval ∷ Seconds
  , user_code ∷ UserCode
  , verification_uri ∷ VerificationURI
  }

derive newtype instance Eq DeviceCodeResponse
derive newtype instance Ord DeviceCodeResponse

instance ReadForeign DeviceCodeResponse where
  readImpl fgn = ado
    res ← readImpl fgn
    in
      DeviceCodeResponse $ res
        { expires_in = Seconds res.expires_in
        , interval = Seconds res.interval
        }

instance WriteForeign DeviceCodeResponse where
  writeImpl (DeviceCodeResponse rec) = writeImpl
    ( rec
        { expires_in = un Seconds rec.expires_in
        , interval = un Seconds rec.interval
        }
    )

newtype DeviceCode = DeviceCode String

newtype UserCode = UserCode String

newtype VerificationURI = VerificationURI String

type AccessTokenRequest =
  { client_id ∷ ClientID
  , device_code ∷ DeviceCode
  , grant_type ∷ GrantType
  }

type DeviceTokenError =
  { error ∷ String, error_description ∷ String, error_uri ∷ String }

newtype GrantType = GrantType String

-- Instance boilerplate
derive instance Newtype GrantType _
derive instance Eq GrantType
derive instance Ord GrantType
derive newtype instance Show GrantType
derive newtype instance WriteForeign GrantType
derive newtype instance ReadForeign GrantType

derive instance Newtype DeviceCode _
derive instance Eq DeviceCode
derive instance Ord DeviceCode
derive newtype instance Show DeviceCode
derive newtype instance WriteForeign DeviceCode
derive newtype instance ReadForeign DeviceCode

derive instance Newtype UserCode _
derive instance Eq UserCode
derive instance Ord UserCode
derive newtype instance Show UserCode
derive newtype instance WriteForeign UserCode
derive newtype instance ReadForeign UserCode

derive instance Newtype VerificationURI _
derive instance Eq VerificationURI
derive instance Ord VerificationURI
derive newtype instance Show VerificationURI
derive newtype instance WriteForeign VerificationURI
derive newtype instance ReadForeign VerificationURI