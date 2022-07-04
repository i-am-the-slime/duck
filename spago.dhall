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
{ name = "spago-viz"
, dependencies =
  [ "aff"
  , "aff-promise"
  , "arrays"
  , "bifunctors"
  , "colors"
  , "console"
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
  , "nullable"
  , "ordered-collections"
  , "partial"
  , "plumage"
  , "posix-types"
  , "prelude"
  , "profunctor-lenses"
  , "react-basic"
  , "react-basic-dom"
  , "react-basic-emotion"
  , "react-basic-hooks"
  , "react-virtuoso"
  , "record"
  , "refs"
  , "remotedata"
  , "routing"
  , "routing-duplex"
  , "ry-blocks"
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
  , "variant"
  , "web-dom"
  , "web-events"
  , "web-html"
  , "web-router"
  , "web-storage"
  , "yoga-fetch"
  , "yoga-json"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
