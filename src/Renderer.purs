module Renderer where

import Prelude

import Data.Foldable (for_)
import Data.Maybe (Maybe)
import Effect (Effect)
import React.Basic (JSX)
import React.Basic.DOM (hydrate)
import UI.Component (runComponent)
import UI.Ctx.Electron (electronCtx)
import UI.Start as Start
import Web.DOM (Element)
import Web.DOM.NonElementParentNode (getElementById)
import Web.HTML (window)
import Web.HTML.HTMLDocument as HTMLDocument
import Web.HTML.Window (document)

main :: Effect Unit
main = do
  contentDivʔ <- getContentDiv
  entryView <- mkEntryView
  for_ contentDivʔ do
    hydrate entryView

mkEntryView :: Effect JSX
mkEntryView = runComponent electronCtx
  (Start.mkView <@> unit)

getContentDiv :: Effect (Maybe Element)
getContentDiv =
  window
    >>= document
    <#> HTMLDocument.toNonElementParentNode
    >>= getElementById "content"