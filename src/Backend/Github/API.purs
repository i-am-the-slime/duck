module Backend.Github.API where

import Prelude

import Backend.Github.API.Types (GithubGraphQLQuery, GithubGraphQLResponse(..), unGithubGraphQLQuery)
import Biz.OAuth.Types (AccessToken(..), GithubAccessToken, TokenType(..))
import Data.Newtype (un)
import Effect.Aff (Aff)
import Foreign.Object as Object
import Yoga.Fetch (postMethod)
import Yoga.Fetch as F
import Yoga.Fetch.Impl.Node (nodeFetch)

sendRequest ∷ GithubAccessToken → GithubGraphQLQuery → Aff GithubGraphQLResponse
sendRequest { access_token, token_type } query = do
  response ← F.fetch nodeFetch (F.URL "https://api.github.com/graphql")
    { method: postMethod
    , headers: Object.fromHomogeneous
        { "Authorization": un TokenType token_type <> " " <> un AccessToken
            access_token
        , "Content-Type": "application/json"
        }
    , body: unGithubGraphQLQuery query
    }
  body ← F.text response
  pure (GithubGraphQLResponse body)
