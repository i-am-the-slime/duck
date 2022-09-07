module Backend.Github.API where

import Prelude

import Affjax as AX
import Affjax.Node as AN
import Affjax.RequestBody as RequestBody
import Affjax.RequestHeader (RequestHeader(..))
import Affjax.ResponseFormat as ResponseFormat
import Backend.Github.API.Types (GithubGraphQLQuery, GithubGraphQLResponse(..), unGithubGraphQLQuery)
import Biz.OAuth.Types (AccessToken(..), GithubAccessToken, TokenType(..))
import Data.Either (Either(..))
import Data.HTTP.Method (Method(..))
import Data.Maybe (Maybe(..))
import Data.Newtype (un)
import Effect.Aff (Aff, throwError)
import Effect.Aff as Aff
import Effect.Class.Console as Console

sendRequest ∷ GithubAccessToken → GithubGraphQLQuery → Aff GithubGraphQLResponse
sendRequest { access_token, token_type } query = do
  errorOrResponse ← AN.request
    ( AX.defaultRequest
        { url = "https://api.github.com/graphql"
        , method = Left POST
        , responseFormat = ResponseFormat.string
        , headers =
            [ RequestHeader "Authorization" $ un TokenType token_type <> " "
                <> un AccessToken
                  access_token
            ]
        , content = (Just (RequestBody.string (unGithubGraphQLQuery query)))
        }
    )
  case errorOrResponse of
    Left err → do
      Console.error (AX.printError err)
      throwError (Aff.error $ AX.printError err)
    Right response → do
      pure (GithubGraphQLResponse $ response.body)
