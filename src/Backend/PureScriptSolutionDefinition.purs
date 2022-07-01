module Backend.PureScriptSolutionDefinition where

import Prelude

import Biz.PureScriptSolutionDefinition.Types (PureScriptSolutionDefinition, pureScriptSolutionFileName)
import Data.Either (Either(..))
import Effect.Aff (Aff, error, throwError)
import Effect.Class (liftEffect)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (readTextFile)
import Node.FS.Sync as FS
import Node.Path (FilePath)
import Node.Path as Path
import Yoga.JSON (readJSON)

readSolutionDefinition ∷
  FilePath → Aff PureScriptSolutionDefinition
readSolutionDefinition dir = do
  let path = Path.concat [ dir, pureScriptSolutionFileName ]
  fileExists ← FS.exists path # liftEffect
  when (not fileExists) do
    throwError $ error $ "No .purescript-solution.json file in " <> path
  strFile ← readTextFile UTF8 path
  case readJSON strFile of
    Left err → throwError $ error $ "Invalid .purescript-solution.json file:\n"
      <> show err
    Right solutionDefinition →
      pure solutionDefinition