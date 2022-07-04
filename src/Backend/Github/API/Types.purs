module Backend.Github.API.Types
  ( GithubGraphQLQuery
  , githubGraphQLQuery
  , unGithubGraphQLQuery
  , GithubGraphQLResponse(..)
  ) where

import Prelude

import Biz.GraphQL (GraphQLQuery)
import Data.Newtype (class Newtype)
import Yoga.JSON (class ReadForeign, class WriteForeign, writeJSON)

newtype GithubGraphQLQuery = GithubGraphQLQuery String

githubGraphQLQuery ∷
  ∀ q. WriteForeign { | q } ⇒ GraphQLQuery { | q } → GithubGraphQLQuery
githubGraphQLQuery = GithubGraphQLQuery <<< writeJSON

unGithubGraphQLQuery ∷ GithubGraphQLQuery → String
unGithubGraphQLQuery (GithubGraphQLQuery q) = q

newtype GithubGraphQLResponse = GithubGraphQLResponse String

derive instance Eq GithubGraphQLQuery
derive instance Ord GithubGraphQLQuery
derive newtype instance Show GithubGraphQLQuery
derive newtype instance WriteForeign GithubGraphQLQuery
derive newtype instance ReadForeign GithubGraphQLQuery

derive instance Newtype GithubGraphQLResponse _
derive instance Eq GithubGraphQLResponse
derive instance Ord GithubGraphQLResponse
derive newtype instance Show GithubGraphQLResponse
derive newtype instance WriteForeign GithubGraphQLResponse
derive newtype instance ReadForeign GithubGraphQLResponse