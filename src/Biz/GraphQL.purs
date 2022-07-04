module Biz.GraphQL (graphQLQuery, GraphQLQuery, GraphQL(..)) where

import Prelude

import Data.Newtype (class Newtype, un)
import Data.String (Pattern(..), Replacement(..), replaceAll)
import Yoga.JSON (class ReadForeign, class WriteForeign)

graphQLQuery ∷
  ∀ v. GraphQL → { | v } → GraphQLQuery { | v }
graphQLQuery query variables = GraphQLQuery $
  { variables: variables
  , query:
      replaceAll (Pattern "\n") (Replacement " ")
        <<< replaceAll (Pattern "\r\n") (Replacement " ")
        $ un GraphQL query

  }

newtype GraphQLQuery v = GraphQLQuery { variables ∷ v, query ∷ String }

derive instance Eq v ⇒ Eq (GraphQLQuery v)
derive instance Ord v ⇒ Ord (GraphQLQuery v)
derive newtype instance Show v ⇒ Show (GraphQLQuery v)
derive newtype instance WriteForeign v ⇒ WriteForeign (GraphQLQuery v)
derive newtype instance ReadForeign v ⇒ ReadForeign (GraphQLQuery v)

newtype GraphQL = GraphQL String

derive instance Newtype GraphQL _
derive instance Eq GraphQL
derive instance Ord GraphQL
derive newtype instance Show GraphQL
derive newtype instance WriteForeign GraphQL
derive newtype instance ReadForeign GraphQL