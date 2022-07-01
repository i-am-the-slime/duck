module Biz.PureScriptSolution.Types where

import Prelude

import Biz.PureScriptSolutionDefinition.Types (EntryPointType)
import Biz.Spago.Types (ProjectConfig)
import Biz.Spago.Types as Spago
import Data.Generic.Rep (class Generic)
import Data.Maybe (Maybe)
import Data.Show.Generic (genericShow)
import Node.Path (FilePath)
import Type.Row (type (+))

type PureScriptSolution =
  { name ∷ String
  , projects ∷ Array PureScriptProject
  }

type SpagoProjectInfo r =
  ( root ∷ FilePath
  , entrypoints ∷
      Array
        { spago_file ∷ FilePath
        , project_configuration ∷ Spago.ProjectConfig
        , build_command ∷ Maybe String
        , type ∷ EntryPointType
        }
  | r
  )

data PureScriptProject
  = SpagoAppProject { | SpagoProjectInfo () }
  | SpagoLibraryProject { | SpagoProjectInfo + SpagoLibData }

derive instance Generic PureScriptProject _
instance Show PureScriptProject where
  show = genericShow

derive instance Eq PureScriptProject
derive instance Ord PureScriptProject

type SpagoProjectData r = (config ∷ ProjectConfig | r)

type SpagoLibData =
  ( versionInPackageSet ∷ Maybe String
  , versionInPursuit ∷ Maybe String
  )