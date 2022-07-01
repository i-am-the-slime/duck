module Biz.Github where

import Biz.OAuth.Types (ClientID(..))

clientID ∷ ClientID
clientID = ClientID "e1bbd08c15830196cff5"

scopes ∷ Array String
scopes = [ "user", "repo" ]