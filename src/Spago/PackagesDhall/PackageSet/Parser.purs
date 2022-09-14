module Spago.PackagesDhall.PackageSet.Parser where

import Prelude

import Biz.Github.Types (Repository(..))
import Biz.Spago.Types (ProjectName(..), SourceGlob(..), Version(..))
import Data.Either (Either)
import Data.Maybe (Maybe(..), maybe)
import Data.String (Pattern(..), contains, stripSuffix)
import Data.Traversable (traverse)
import Dhall.Parser as DhallParser
import Dhall.Types (DhallLiteral(..), LetInBinding, LocalImport, RemoteImport(..))
import Foreign.Object (Object)
import Foreign.Object as Object
import Parsing (ParseError, Parser, fail, runParser)
import Parsing.String (eof)
import Spago.PackagesDhall.Types (Change(..), PackagesDhall)

parsePackageSetDhall ∷ String → Either ParseError PackagesDhall
parsePackageSetDhall s = runParser s do
  leadingComment ← DhallParser.multiLineComment
  DhallParser.skipSpacesAndComments
  { packageSet, changes } ← do
    binding ← DhallParser.dhallLetInBinding
    parsePackageSet binding
  DhallParser.skipSpacesAndComments
  eof
  pure { leadingComment, packageSet, changes }
  where
  parsePackageSet ∷ LetInBinding → Parser String _
  parsePackageSet { name, value, with } = do
    unless (name == "upstream") (fail "Expected upstream variable")
    { url, hash } ← case value of
      DhallRemoteImport (RemoteImport { url, hash }) → pure { url, hash }
      _ → fail "Only remote imports allowed for upstream"
    changes ∷ Array { name ∷ ProjectName, change ∷ Change } ←
      with # traverse parseChange

    pure
      { packageSet: { link: url, sha: hash }
      , changes
      }
    where
    parseChange { name: rawName, value } = do
      { name, change } ← case value of
        DhallArray arr
          | Just dn ← stripSuffix (Pattern ".dependencies") rawName → do
              deps ←
                ( arr # traverse
                    case _ of
                      DhallString str → pure $ ProjectName str
                      _ → fail $ "Can't have non-string dependency"

                )
              pure { name: dn, change: DependenciesChange deps }
        DhallString repo | Just dn ← stripSuffix (Pattern ".repo") rawName →
          pure { name: dn, change: RepoChange (Repository repo) }
        DhallString version
          | Just dn ← stripSuffix (Pattern ".version") rawName →
              pure { change: VersionChange (Version version), name: dn }
        DhallRecord rec | rawName # not contains (Pattern ".") → do
          dependencies ← getDependencies rec
          repo ← Object.lookup "repo" rec # maybe
            (fail "Missing repo")
            case _ of
              DhallString str → pure (Repository str)
              _ → fail "Can't have non-string repo"

          version ← Object.lookup "version" rec # maybe
            (fail "Missing version")
            case _ of
              DhallString str → pure (Version str)
              _ → fail "Can't have non-string version"
          pure $
            { name: rawName
            , change: CompleteChange { dependencies, repo, version }
            }
        _ → fail ("Invalid change " <> name)
      pure { name: ProjectName name, change }

getDependencies ∷ Object DhallLiteral → Parser String (Array ProjectName)
getDependencies = Object.lookup "dependencies" >>> maybe
  (fail "Couldn't find dependencies in dhall file")
  case _ of
    DhallArray arr → arr # traverse case _ of
      DhallString str → pure (ProjectName str)
      _ → fail "All dependencies must be strings"
    _ → fail $ "Dependencies can only be an array of strings."

getPackages ∷ Object DhallLiteral → Parser String LocalImport
getPackages = Object.lookup "packages" >>> maybe
  (fail "Couldn't find packages in dhall file")
  case _ of
    DhallLocalImport imp → pure imp
    _ → fail $ "Packages can only be a simple local import"

getName ∷ Object DhallLiteral → Parser String String
getName = Object.lookup "name" >>> maybe
  (fail "Couldn't find name in dhall file")
  case _ of
    DhallString name → pure name
    _ → fail $ "Packages can only be a simple local import"

getSources ∷ Object DhallLiteral → Parser String (Array SourceGlob)
getSources = Object.lookup "sources" >>> maybe
  (fail "Couldn't find sources in dhall file")
  case _ of
    DhallArray arr → arr # traverse case _ of
      DhallString str → pure (SourceGlob str)
      _ → fail "All sources must be strings"
    _ → fail $ "Sources can only be an array of strings."
