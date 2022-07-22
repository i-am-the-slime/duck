module UI.Github where

import Yoga.Prelude.View

import Biz.Github.Types (Login(..), Repository(..))
import UI.Component as UI
import UI.Github.Repo.View as GithubRepo
import UI.Github.Root as GithubRoot
import UI.Navigation.Router.Page.Github as Github

mkView ∷ UI.Component (Github.Route)
mkView = do
  rootView ← GithubRoot.mkView
  repoView ← GithubRepo.mkView
  UI.component "Preferences" \_ route → React.do
    pure case route of
      Github.Root → rootView {}
      Github.Repository (Login owner) (Repository repo) →
        repoView { repo: { owner, repoName: repo } }
