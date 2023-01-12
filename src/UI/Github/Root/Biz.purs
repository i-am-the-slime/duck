module UI.Github.Root.Biz where

import Prelude

import Biz.Github.Types (Login)
import Biz.GraphQL (GraphQL(..))
import Data.Maybe (Maybe(..))
import Data.Time.Duration (Days(..), convertDuration)
import Effect (Effect)
import React.Basic.Hooks (Hook)
import React.Basic.Hooks as React
import UI.Ctx.Types (Ctx)
import UI.GithubLogin.UseGithubGraphQL (UseGithubGraphQL, useGithubGraphQL)

useGetUserRepos ∷ Ctx → Hook (UseGithubGraphQL QueryInput) _
useGetUserRepos ctx = React.do
  { data: result, send } ∷
    { data ∷ _ _ { | QueryOutput }
    , send ∷ { | QueryInput } → Effect Unit
    } ← useGithubGraphQL
    ctx
    (Just (7.0 # Days # convertDuration))
    query

  -- useEffectAlways do
  --   case result of
  --     NotAsked -> send { login: }
  pure unit

type QueryInput = (login ∷ Login)

type QueryOutput =
  ( data ∷
      { user ∷
          { repositories ∷
              { nodes ∷
                  Array
                    { languages ∷
                        { edges ∷ Array { node ∷ { name ∷ String }, size ∷ Int }
                        }
                    , latestRelease ∷ Maybe { id ∷ String, createdAt ∷ String }
                    , name ∷ String
                    , url ∷ String
                    }
              }
          }
      }
  )

query = GraphQL
  """
query($login: String!) {
  user(login: $login) {
    repositories(first: 50, isFork: false){
      nodes {
        name
        url
        latestRelease {
          id
          createdAt
        }
  			languages (first: 5){
  			  edges {
            size
  			    node {
  			      name
  			    }
  			  }
  			}
      }
    }
  }
}
"""
