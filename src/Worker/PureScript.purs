module Worker.PureScript (create) where

import Prelude

import Effect (Effect)
import Effect.Class.Console (log)
import Effect.Uncurried (EffectFn2, mkEffectFn2)

create ∷ ∀ a b. EffectFn2 { | a } { | b } Int
create = mkEffectFn2 createImpl

createImpl ∷ ∀ a b. { | a } → { | b } → Effect Int
createImpl ctx createData = do
  log "Fuck you"
  pure 12
