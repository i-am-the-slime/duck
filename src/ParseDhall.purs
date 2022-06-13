module ParseDhall where

import Prelude

import Control.Monad.Free (resume)
import Control.Monad.Writer.Trans (WriterT(..))
import Data.Either (Either(..), note, hush)
import Data.Foldable (for_)
import Data.Lens as Lens
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Data.Newtype (un, unwrap, wrap)
import Data.Traversable (class Traversable, for, traverse)
import Data.TraversableWithIndex (traverseWithIndex)
import Data.Tuple (Tuple(..), fst)
import Data.Variant (Variant)
import Debug (spy)
import Dhall.API.Conversions (auto)
import Dhall.API.Conversions as Conv
import Dhall.Core as Dhall
import Dhall.Core as Imports
import Dhall.Imports.Headers as Headers
import Dhall.Imports.Resolve as Resolve
import Dhall.Imports.Retrieve as Retrieve
import Dhall.Map as Dhall.Map
import Dhall.Parser (ParseExpr)
import Dhall.Parser as DhallParser
import Dhall.Printer as Printer
import Dhall.TypeCheck as DhallTC
import Dhall.TypeCheck as TC
import Effect.Aff (Aff)
import Effect.Class.Console (log, logShow)
import Record as Record
import Type.Proxy (Proxy(..))
import Unsafe.Coerce (unsafeCoerce)
import Validation.These as V

type SpagoDhall =
  { name :: String
  , dependencies :: Array String
  , sources :: Array String
  , packages :: Dhall.Import
  }

type SpagoProjectConfigWithPackages =
  { name :: String
  , dependencies :: Array String
  , sources :: Array String
  , packages :: Map String SpagoPackage
  }

type SpagoPackagesCodec =
  Array { mapKey :: String, mapValue :: SpagoPackage }

type SpagoPackage =
  { repo :: String, version :: String, dependencies :: Array String }

resolver :: Dhall.ImportType -> Resolve.R
resolver target =
  { stack: pure $ Resolve.Localized $ Dhall.Import
      { importMode: Dhall.Code, importType: target }
  , retriever: Retrieve.nodeRetrieve
  , cacher: Retrieve.nodeCache
  }

print :: forall i. (i -> String) -> Dhall.Expr Dhall.InsOrdStrMap i -> String
print i = Printer.printAST
  { ascii: true
  , printImport: i
  , line: Just (wrap 150)
  , tabs: { width: wrap 2, soft: true, align: false }
  }

getPackagesField
  :: Dhall.Expr Dhall.InsOrdStrMap Void
  -> Either String (Map String SpagoPackage)
getPackagesField =
  -- Get the packages field
  Lens.preview (Dhall._E Dhall._RecordLit) >>> note "Expected config record"
    >=> Dhall.Map.get "packages" >>> note "Expected packages field"
    -- As a Dhall.Map.InsOrdStrMap
    >=> getPackages

getPackages
  :: Dhall.Expr Dhall.InsOrdStrMap Void
  -> Either String (Map String SpagoPackage)
getPackages =
  Lens.preview (Dhall._E Dhall._RecordLit)
    >>> note "Expected packages record"
    -- Convert to Data.Map.Map
    >>> map (Dhall.Map.unIOSM >>> Map.fromFoldable)
    -- And extract each key using the automatic codec
    >=>
      let
        Conv.OutputType { extract } = auto
      in
        traverseWithIndex
          (\k v -> note ("Failed to extract key " <> show k) (extract v))

projectAndExtract
  :: Dhall.ImportType
  -> Dhall.Expr Dhall.InsOrdStrMap Dhall.Import
  -> Aff (Maybe SpagoProjectConfigWithPackages)
projectAndExtract target parsed = do
  -- from src/Dhall/CLI/Main.purs
  -- Resolve any imports in the parsed file first
  originHeaders <- Headers.originHeadersFromLocationAff
    Retrieve.nodeHeadersLocation
  Resolve.runM (resolver target)
    { cache: Map.empty, toBeCached: mempty, originHeaders }
    (Resolve.resolveImportsHere parsed) >>=
    fst >>> un WriterT >>> map fst >>> case _ of
      V.Error es _ -> do
        logShow "Imports failed"
        for_ es \(TC.TypeCheckError { tag }) -> logShow
          (tag :: Variant (Resolve.Errors ()))
        pure Nothing
      V.Success resolved -> do
        -- Use an automatic codec
        let Conv.OutputType { expected, extract } = auto
        -- Project out the fields we want
        -- (aka ignore the problematic `packages` field for now)
        let projected = Dhall.mkProject resolved (Right expected)
        -- Typecheck
        case TC.typeOf projected of
          V.Error es _ -> do
            logShow "Type error"
            for_ es \(TC.TypeCheckError { tag }) -> logShow
              (tag :: Variant (Resolve.Errors ()))
            pure Nothing
          V.Success a -> do
            log $ print show a
            -- Evaluate it
            let normalized = Dhall.normalize resolved
            let projected_normalized = Dhall.normalize projected
            log $ print show projected_normalized

            -- [FIXME]
            -- Extract the information
            case extract projected_normalized of
              Nothing -> do
                logShow "Failed to extract metadata"
                pure Nothing
              Just extracted -> do
                -- Also get package information separately
                case getPackagesField normalized of
                  Left err -> do
                    logShow $ "Failed to extract packages: " <> err
                    pure Nothing
                  Right packages ->
                    pure $ Just $
                      Record.insert (Proxy :: Proxy "packages") packages
                        extracted

-- let projected = Dhall.mkProject parsed (Right expected)
-- -- Typecheck
-- case TC.typeOf projected of
--   V.Error es _ -> do
--     logShow "Type error"
--     for_ es \(TC.TypeCheckError { tag }) -> logShow
--       (tag :: Variant (Resolve.Errors ()))
--     pure Nothing
--   V.Success a -> do
--     -- log $ print show a
--     pure $ Just a

parseDhall :: String -> Aff Unit
parseDhall spagoFile = do
  let importType = Dhall.parseImportType spagoFile
  for_ (DhallParser.parse spagoFile) \parsed -> do
    log $ print show parsed
    extractedʔ <- projectAndExtract importType parsed
    pure unit

-- See if there are no imports in the expression
noImports
  :: forall m a. Traversable m => Dhall.Expr m a -> Maybe (Dhall.Expr m Void)
noImports = traverse \_ -> Nothing

type ImportInfo = String

-- Extract the import info if the expression is _just_ an import
asImport :: forall m. Dhall.Expr m Dhall.Import -> Maybe Dhall.Import
asImport = unwrap >>> resume >>> hush

processImport :: Dhall.Import -> Maybe ImportInfo
processImport (Dhall.Import { importMode: Imports.Code, importType }) =
  case importType of
    Dhall.Local prefix file ->
      Just (Dhall.prettyFilePrefix prefix <> Dhall.prettyFile file)
    Dhall.Remote u -> Just (Dhall.prettyURL u)
    _ -> Nothing
processImport _ = Nothing

probeExpr
  :: forall m
   . Traversable m
  => Dhall.Expr m Dhall.Import
  -> Maybe (Either Dhall.Import (Dhall.Expr m Void))
probeExpr e = case asImport e of
  Just info -> Just (Left info)
  Nothing -> case noImports e of
    Nothing -> Nothing
    Just nothingHere -> Just (Right nothingHere)

-- If we have no imports, we have a chance of typechecking, normalizing, and getting a value out of it
runCodec
  :: forall r
   . Conv.OutputType r
  -> Dhall.Expr Dhall.InsOrdStrMap Void
  -> Maybe r
runCodec (Conv.OutputType { extract, expected }) resolved = do
  _ignoredTypeOfIt <- V.hush
    (DhallTC.typeOf (Dhall.mkAnnot resolved expected))
  let normalized = Dhall.normalize resolved
  extract normalized

runPackages
  :: Dhall.Expr Dhall.InsOrdStrMap Void
  -> Maybe (Map String SpagoPackage)
runPackages resolvedRecord = do
  let
    Conv.OutputType { expected, extract } =
      auto :: Conv.OutputType SpagoPackagesCodec
  -- Use the Dhall builtin `toMap` to convert the record (which has a weird type) to a known type:
  -- λ echo "toMap ./packages.dhall" | dhall type
  -- List
  --   { mapKey : Text
  --   , mapValue : { dependencies : List Text, repo : Text, version : Text }
  --   }

  -- let
  --   resolved :: Dhall.Expr Dhall.InsOrdStrMap Void
  --   resolved = Dhall.mkToMap resolvedRecord Nothing
  -- _ignoredTypeOfIt <- V.hush (DhallTC.typeOf (Dhall.mkAnnot resolved expected))
  let normalized = Dhall.normalize resolvedRecord
  extract normalized <#> map (Tuple <$> _.mapKey <*> _.mapValue) >>>
    Map.fromFoldable

probeCodec
  :: forall r
   . Conv.OutputType r
  -> Dhall.Expr Dhall.InsOrdStrMap Dhall.Import
  -> Maybe (Either Dhall.Import r)
probeCodec codec e = probeExpr e >>= case _ of
  Left i -> Just (Left i)
  Right e' -> Right <$> runCodec codec e'

probeCodecField
  :: forall r
   . Conv.OutputType r
  -> String
  -> Dhall.InsOrdStrMap (Dhall.Expr Dhall.InsOrdStrMap Dhall.Import)
  -> Maybe (Either Dhall.Import r)
probeCodecField codec field es = Dhall.Map.get field es >>= probeCodec codec

justKidding
  :: Dhall.Expr Dhall.InsOrdStrMap Dhall.Import
  -> Maybe (Map String SpagoPackage)
justKidding parsed = do
  -- Replace all imports with `{=}` the empty record
  let resolved = parsed >>= \_ -> Dhall.mkRecordLit Dhall.Map.empty
  runPackages resolved

-- runPackages resolved

parseDhall2 :: String -> Aff (Maybe SpagoDhall)
parseDhall2 spagoFile = do
  let parsedʔ = DhallParser.parse spagoFile
  join <$> for parsedʔ \(parsed :: ParseExpr) -> do
    -- log $ print show parsed
    case Lens.preview (Dhall._E Dhall._RecordLit) parsed of
      Nothing -> Nothing <$ log "Expected config to be a record literal"
      Just fields -> pure do
        name <- probeCodecField auto "name" fields >>= hush
        dependencies <- probeCodecField auto "dependencies" fields >>= hush
        sources <- probeCodecField auto "sources" fields >>= hush
        packages <- Dhall.Map.get "packages" fields >>= asImport
        pure
          { name
          , dependencies
          , sources
          , packages
          }

parsePackagesDhall :: String -> Aff (Maybe (Map String SpagoPackage))
parsePackagesDhall packagesFile = do
  let parsedʔ = DhallParser.parse packagesFile
  pure $ justKidding =<< parsedʔ
