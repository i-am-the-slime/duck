module Backend.PureScriptSolution where

import Prelude

import Biz.PureScriptSolution.Types (PureScriptSolution, ProjectConfiguration)
import Biz.PureScriptSolution.Types as Solution
import Biz.PureScriptSolutionDefinition.Types (EntryPointType(..), Entrypoint, PureScriptSolutionDefinition)
import Biz.PureScriptSolutionDefinition.Types as Definition
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NEA
import Data.Either (Either(..), either, note)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.String (Pattern(..))
import Data.String as String
import Data.Traversable (traverse)
import Dhall.Types (LocalImport(..))
import Effect.Aff (Aff, error, throwError)
import Effect.Class (liftEffect)
import Fetch (fetch)
import Node.ChildProcess (Exit(..), defaultSpawnOptions)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (readTextFile, writeTextFile)
import Node.FS.Sync as FS
import Node.Path (FilePath)
import Node.Path as Path
import Record (merge)
import Spago.PackagesDhall.PackageSet.Parser (parsePackageSetDhall)
import Spago.PackagesDhall.PackageSet.Types (PackageSet)
import Spago.PackagesDhall.Parser (parsePackagesDhall)
import Spago.PackagesDhall.Types (PackagesDhall)
import Spago.SpagoDhall.Parser (parseSpagoDhall)
import Spago.SpagoDhall.Types (SpagoDhall)
import Sunde (spawn)
import Yoga.JSON (writeJSON)

resolveSolutionDefinition ∷
  FilePath → PureScriptSolutionDefinition → Aff PureScriptSolution
resolveSolutionDefinition path def = do
  projects ← def.projects # traverse toProject
  pure { name: def.name, projects }
  where
  toProject = case _ of
    Definition.SpagoApp app → do
      entrypoints ← app.entrypoints # traverse \ep@{ spago_file } → do
        project_configuration ← resolveProjectConfiguration
          { root: app.root, spago_file }
        pure $ ep # merge { project_configuration }
      pure $ Solution.SpagoAppProject
        (app # merge { entrypoints })

    Definition.SpagoLibrary lib → do
      entrypoints ← lib.entrypoints # traverse \ep@{ spago_file } → do
        project_configuration ← resolveProjectConfiguration
          { root: lib.root, spago_file }
        pure $ ep # merge { project_configuration }
      pure $ Solution.SpagoLibraryProject
        ( lib # merge
            { entrypoints
            -- [FIXME] Retrieve from Github
            , versionInPackageSet: Nothing
            -- [FIXME] Retrieve from Pursuit
            , versionInPursuit: Nothing
            }
        )

  resolveProjectConfiguration ∷ _ → Aff ProjectConfiguration
  resolveProjectConfiguration { root, spago_file } = do
    spagoDhall ∷ SpagoDhall ← getSpagoDhall path root spago_file
    packagesDhall ∷ PackagesDhall ← getPackagesDhall path root
      spagoDhall.packages
    packageSet ∷ PackageSet ← getPackageSet packagesDhall.packageSet.link

    pure
      { spagoDhall: Right spagoDhall
      , packagesDhall
      , packageSet
      }

ensurePathExists p = do
  pathExistsʔ ← FS.exists p # liftEffect
  when (not pathExistsʔ) do
    throwError $ error $ "No such file: " <> p

getSpagoDhall ∷ FilePath → FilePath → FilePath → Aff SpagoDhall
getSpagoDhall path root spago_file = do
  let spagoPath = Path.concat [ path, root, spago_file ]
  ensurePathExists spagoPath
  spagoDhallString ← readTextFile UTF8 spagoPath
  parseSpagoDhall spagoDhallString # either
    (\e → throwError $ error ("Invalid spago dhall:\n" <> show e))
    pure

getPackagesDhall ∷ FilePath → FilePath → LocalImport → Aff _
getPackagesDhall path root (LocalImport relPath) = do
  packagesDhallPath ← Path.resolve [ path, root ] relPath # liftEffect
  ensurePathExists packagesDhallPath
  packagesDhallString ← readTextFile UTF8 packagesDhallPath
  parsePackagesDhall packagesDhallString # either
    (\e → throwError $ error ("Invalid packages dhall:\n" <> show e))
    pure

getPackageSet ∷ String → Aff PackageSet
getPackageSet url = do
  packageSetString ← fetch url {} >>= _.text
  writeTextFile UTF8 "/tmp/package-set.dhall" packageSetString
  parsePackageSetDhall packageSetString # either
    (\e → throwError $ error ("Invalid package set dhall:\n" <> show e))
    pure

createNewPureScriptSolution ∷ FilePath → PureScriptSolutionDefinition → Aff Unit
createNewPureScriptSolution path solution =
  writeTextFile UTF8 path (writeJSON solution)

buildEntryPoint ∷ FilePath → Entrypoint → Aff (Either String String)
buildEntryPoint path entrypoint = do
  let invalidOrValidBuildCommand = getBuildCommand entrypoint
  case invalidOrValidBuildCommand of
    Left invalid → throwError $ error $ "Invalid build command: " <> invalid
    Right valid → do
      { exit, stderr, stdout } ← spawn
        { cmd: NEA.head valid, args: NEA.tail valid, stdin: Nothing }
        (defaultSpawnOptions { cwd = Just path })
      pure case exit of
        Normally 0 → Right stdout
        _ → Left stderr

getBuildCommand ∷ Entrypoint → Either String (NonEmptyArray String)
getBuildCommand entrypoint =
  NEA.fromArray (String.split space rawCommand) # note rawCommand
  where
  space = Pattern " "
  rawCommand = entrypoint.build_command # fromMaybe fallbackCommand
  fallbackCommand =
    "spago -x "
      <> entrypoint.spago_file
      <> " "
      <> entrypointSubcommand
      <> " --json-errors"
  entrypointSubcommand = case entrypoint.type of
    Build → "build"
    Test → "test"
