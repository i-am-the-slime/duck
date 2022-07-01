module Story.Ctx where

import Prelude

import Biz.IPC.Message.Types (MainToRendererChannel, RendererToMainChannel)
import Data.Array (singleton)
import Data.Array as Array
import Data.Foldable (for_, traverse_)
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Data.Tuple.Nested (type (/\), (/\))
import Effect (Effect)
import Effect.Aff.Compat (EffectFn2, runEffectFn2)
import Effect.Ref as Ref
import ElectronAPI (ElectronListener)
import Foreign (Foreign)
import React.Basic (JSX)
import React.Basic.DOM (text)
import Story.Util.NotificationCentre (storyNotificationCentre)
import UI.Component (Ctx)
import Unsafe.Coerce (unsafeCoerce)
import Unsafe.Reference (unsafeRefEq)
import Yoga.Fetch.Impl.Node (nodeFetch)

type OnMessage =
  RendererToMainChannel →
  Foreign →
  Effect (Maybe (MainToRendererChannel /\ Foreign))

mkStoryCtx ∷ OnMessage → Effect Ctx
mkStoryCtx onMessage = do
  listenersRef ← Ref.new
    (Map.empty ∷ _ MainToRendererChannel (Array ElectronListener))
  let
    registerListener channel listener = do
      listenersRef # Ref.modify_
        ( flip Map.alter channel case _ of
            Just ls → Just (Array.cons listener ls)
            Nothing → Just [ listener ]
        )
    removeListener channel listener = do
      listenersRef # Ref.modify_
        ( flip Map.alter channel case _ of
            Just ls → Just (Array.filter (unsafeRefEq listener) ls)
            Nothing → Nothing
        )

    postMessage channel payload = do
      responseʔ ← onMessage channel payload
      for_ responseʔ \(responseChannel /\ responseMessage) → do
        listenersRef # Ref.read >>= \listeners →
          case Map.lookup responseChannel listeners of
            Just ls → traverse_
              ( \listener →
                  ( ( (unsafeCoerce listener) ∷
                        EffectFn2 Foreign Foreign Unit
                    ) # runEffectFn2
                  ) responseMessage responseMessage
              )
              ls
            Nothing → mempty

  pure
    { registerListener
    , removeListener
    , postMessage
    , notificationCentre: storyNotificationCentre
    , fetchImpl: nodeFetch
    }

class ToJSX jsx where
  toJSX ∷ jsx → Array JSX

instance ToJSX (Array JSX) where
  toJSX = identity
else instance (ToJSX t) ⇒ ToJSX (Array t) where
  toJSX arr = arr >>= toJSX
else instance ToJSX String where
  toJSX = text >>> singleton
else instance ToJSX JSX where
  toJSX = singleton

comma ∷ ∀ a b. ToJSX a ⇒ ToJSX b ⇒ a → b → Array JSX
comma a b = toJSX a <> toJSX b

infixl 5 comma as ++