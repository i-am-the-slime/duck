module Data.Array.Extra where

import Prelude

import Control.Monad.ST (run, while) as ST
import Control.Monad.ST.Ref (modify, new, read) as ST
import Data.Array as Array
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NonEmptyArray
import Data.Array.ST as STArray
import Data.Foldable (for_)

chunked ∷ ∀ a. Int → Array a → Array (NonEmptyArray a)
chunked chunkSize arr = ST.run do
  iRef ← ST.new 0
  result ← STArray.new
  ST.while (ST.read iRef <#> (_ < Array.length arr)) do
    i ← ST.read iRef
    let chunk = Array.slice i (i + chunkSize) arr
    for_ (NonEmptyArray.fromArray chunk) (\res → STArray.push res result)
    _ ← iRef # ST.modify (_ + chunkSize)
    pure unit
  STArray.freeze result