{-
Welcome to a Spago project!
You can edit this file as you like.

Need help? See the following resources:
- Spago documentation: https://github.com/purescript/spago
- Dhall language tour: https://docs.dhall-lang.org/tutorials/Language-Tour.html

When creating a new Spago project, you can use
`spago init --no-comments` or `spago init -C`
to generate this file without the comments in this block.
-}
{ name = "duck"
, dependencies =
  [ "aff"
  , "aff-promise"
  , "affjax"
  , "affjax-node"
  , "argonaut-core"
  , "arrays"
  , "avar"
  , "barlow-lens"
  , "bifunctors"
  , "colors"
  , "console"
  , "contravariant"
  , "control"
  , "datetime"
  , "debug"
  , "dhall-purescript"
  , "effect"
  , "either"
  , "enums"
  , "fahrtwind"
  , "foldable-traversable"
  , "foreign"
  , "foreign-generic"
  , "foreign-object"
  , "framer-motion"
  , "free"
  , "functions"
  , "http-methods"
  , "integers"
  , "interpolate"
  , "js-date"
  , "lists"
  , "matryoshka"
  , "maybe"
  , "newtype"
  , "node-buffer"
  , "node-child-process"
  , "node-fs"
  , "node-fs-aff"
  , "node-path"
  , "node-process"
  , "node-streams"
  , "now"
  , "nullable"
  , "numbers"
  , "ordered-collections"
  , "parallel"
  , "partial"
  , "plumage"
  , "posix-types"
  , "prelude"
  , "profunctor-lenses"
  , "react-basic"
  , "react-basic-dom"
  , "react-basic-emotion"
  , "react-basic-hooks"
  , "react-icons"
  , "react-virtuoso"
  , "record"
  , "record-extra"
  , "refs"
  , "remotedata"
  , "routing"
  , "routing-duplex"
  , "ry-blocks"
  , "st"
  , "strings"
  , "strings-extra"
  , "tailrec"
  , "transformers"
  , "tuples"
  , "typelevel-prelude"
  , "uncurried-transformers"
  , "unsafe-coerce"
  , "unsafe-reference"
  , "untagged-union"
  , "uuid"
  , "variant"
  , "web-dom"
  , "web-events"
  , "web-html"
  , "web-router"
  , "web-storage"
  , "web-uievents"
  , "yoga-fetch"
  , "yoga-json"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
