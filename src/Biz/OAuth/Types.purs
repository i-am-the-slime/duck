module Biz.OAuth.Types where

import Prelude

import Data.Newtype (class Newtype)
import Yoga.JSON (class ReadForeign, class WriteForeign)

type GithubAccessToken =
  { access_token ∷ AccessToken
  , token_type ∷ TokenType
  , scope ∷ ScopeList
  }

newtype AccessToken = AccessToken String

derive instance Newtype AccessToken _
derive instance Eq AccessToken
derive instance Ord AccessToken
derive newtype instance Show AccessToken
derive newtype instance WriteForeign AccessToken
derive newtype instance ReadForeign AccessToken

newtype TokenType = TokenType String

derive instance Newtype TokenType _
derive instance Eq TokenType
derive instance Ord TokenType
derive newtype instance Show TokenType
derive newtype instance WriteForeign TokenType
derive newtype instance ReadForeign TokenType

newtype ScopeList = ScopeList String

derive instance Newtype ScopeList _
derive instance Eq ScopeList
derive instance Ord ScopeList
derive newtype instance Show ScopeList
derive newtype instance WriteForeign ScopeList
derive newtype instance ReadForeign ScopeList

newtype RedirectURL = RedirectURL String
newtype CallbackURL = CallbackURL String
newtype ClientID = ClientID String
newtype ClientSecret = ClientSecret String

derive instance Newtype RedirectURL _
derive instance Newtype CallbackURL _
derive instance Newtype ClientID _
derive instance Newtype ClientSecret _

derive newtype instance WriteForeign ClientID