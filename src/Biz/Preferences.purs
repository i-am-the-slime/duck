module Biz.Preferences where

import Prelude

import Biz.Preferences.Types (AppPreferences, defaultAppPreferences)
import Data.Either (Either(..))
import Effect.Aff (Aff, error, throwError)
import Effect.Class (class MonadEffect, liftEffect)
import Electron (getUserDataDirectory)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (readTextFile, writeTextFile)
import Node.FS.Sync (exists)
import Node.Path as Path
import Yoga.JSON (writeJSON)
import Yoga.JSON as JSON

getPreferencesFilePath ∷ ∀ m. MonadEffect m ⇒ m String
getPreferencesFilePath = liftEffect ado
  settingsPath ← getUserDataDirectory # liftEffect
  in Path.concat [ settingsPath, "settings.json" ]

writeAppPreferences ∷ AppPreferences → Aff Unit
writeAppPreferences settings = do
  settingsFilePath ← getPreferencesFilePath
  writeTextFile UTF8 settingsFilePath (writeJSON settings)

readAppPreferences ∷ Aff AppPreferences
readAppPreferences = do
  settingsFilePath ← getPreferencesFilePath
  settingsFileExists ← exists settingsFilePath # liftEffect
  when (not settingsFileExists) do
    writeAppPreferences defaultAppPreferences
  textContent ← readTextFile UTF8 settingsFilePath
  case JSON.readJSON textContent of
    Left err → throwError $ error $ show err
    Right settings → pure settings