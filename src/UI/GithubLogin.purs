module UI.GithubLogin where

import Yoga.Prelude.View

import Biz.Github.Types (DeviceCodeResponse(..), UserCode(..), VerificationURI(..))
import Biz.IPC.Message.Types (MessageToMain(..), MessageToRenderer(..), failedOrToEither)
import Color (cssStringRGBA)
import Control.Monad.Rec.Class (forever)
import Data.Array (intersperse)
import Data.Array as Array
import Data.Bifunctor (lmap)
import Data.Newtype (un)
import Data.String (toCodePointArray)
import Data.String as String
import Data.Time.Duration (Seconds(..), fromDuration, negateDuration)
import Effect.Aff as Aff
import Fahrtwind (background, background', border, borderCol', borderLeft, cursorPointer, flexCol, flexRow, fontFamilyOrMono, gap, gray, height, hover, itemsCenter, justifyAround, justifyBetween, mB, mL, mT, mXAuto, pB, pL, pX, pY, rounded3xl, roundedFull, roundedXl, screenSm, shadowMd, shadowSm, shadowXl, text3xl, text4xl, textCenter, textCol, textCol', textSm, textXl, transition, underline, width, width', widthAndHeight, widthFull)
import Fahrtwind.Icon.Heroicons as Heroicon
import Network.RemoteData (RemoteData(..))
import Network.RemoteData as RD
import Partial.Unsafe (unsafePartial)
import Plumage.Util.HTML as P
import Prim.Row (class Lacks, class Nub)
import React.Basic.DOM as R
import React.Basic.Emotion as E
import React.Basic.Hooks as React
import React.Basic.Hooks.Aff (useAff)
import Record (disjointUnion)
import UI.Component as UI
import UI.Container (modalClickawayId, modalContainerId)
import UI.GithubLogin.GithubLogo (githubLogo)
import UI.Hook.UseIPCMessage (useIPCMessage)
import UI.Modal (mkModalView)
import UI.Notification.ErrorNotification (errorNotification)
import UI.Notification.SendNotification (sendNotification)
import Yoga.Block as Block
import Yoga.Block.Atom.Button as Button
import Yoga.Block.Atom.Button.Types (ButtonType(..)) as ButtonStyle
import Yoga.Block.Container.Style (col)

type Props =
  { onComplete ∷ Effect Unit
  }

useGetDeviceCode ctx = React.do
  response /\ send /\ reset ← useIPCMessage ctx
  let
    res = response # lmap (const "") >>= unsafePartial case _ of
      GithubLoginGetDeviceCodeResult v → RD.fromEither (failedOrToEither v)
  pure (res /\ (send GithubLoginGetDeviceCode) /\ reset)

usePollAccessToken ctx = React.do
  response /\ send /\ reset ← useIPCMessage ctx
  let
    res = response >>= unsafePartial case _ of
      GithubPollAccessTokenResult v → RD.Success
        (failedOrToEither v <#> failedOrToEither)

  -- other → RD.Failure $ "Wrong response type " <> unsafeStringify other
  pure (res /\ (send <<< GithubPollAccessToken) /\ reset)

mkGithubLogin ∷ UI.Component Props
mkGithubLogin = do
  modalView ← mkModalView { clickAwayId: modalClickawayId, modalContainerId } #
    liftEffect
  copyToClipboardButton ← mkCopyToClipboardButton
  UI.component "GithubLoginButton" \ctx (props ∷ Props) → React.do
    let
      notifyError message = sendNotification ctx $
        errorNotification { title: "Error", body: R.text message }
    code /\ getDeviceCode /\ resetCode ← useGetDeviceCode ctx
    let codeʔ = RD.toMaybe code

    accessToken /\ pollAccessToken /\ resetAccessToken ← usePollAccessToken ctx

    useAff codeʔ do
      for_ codeʔ \(DeviceCodeResponse { expires_in, device_code }) → do
        pollAccessToken device_code # liftEffect
        Aff.delay
          (expires_in <> (negateDuration (10.0 # Seconds)) # fromDuration)
        getDeviceCode # liftEffect

    useAff accessToken do
      for_ accessToken \_ →
        for_ codeʔ \(DeviceCodeResponse { interval, device_code }) → forever do
          Aff.delay (interval # fromDuration)
          liftEffect
            ( for_ accessToken case _ of
                Left err → notifyError (show err)
                Right (Left { error }) | error == "authorization_pending" →
                  pollAccessToken device_code # liftEffect
                Right (Left error) → notifyError (show error)
                Right (Right token) → do
                  resetCode
            )

    useEffect code do
      case code of
        Failure err → notifyError err
        _ → mempty
      mempty

    let
      buttonGithubLogo =
        P.div_ (mL 8 <> widthAndHeight 16 <> mB 1) [ githubLogo ]

      loginButton { disabled } =
        githubButton
          { disabled
          , onClick: handler_ getDeviceCode
          }
          [ P.div_ (flexRow <> justifyBetween <> widthFull <> itemsCenter)
              [ P.div_ (E.css { whiteSpace: E.nowrap })
                  [ R.text "Login to Github" ]
              , buttonGithubLogo
              ]
          ]

      loggedOutView = case code of
        NotAsked → loginButton { disabled: false }
        Loading → loginButton { disabled: true }
        Failure _ → loginButton { disabled: false }
        Success _ → fragment
          [ loginButton { disabled: true }
          ]

    pure $ fragment
      [ loggedOutView
      , modalView
          { childʔ: codeʔ <#>
              \(DeviceCodeResponse { user_code, verification_uri }) →
                renderInstructions
                  (copyToClipboardButton $ un UserCode user_code)
                  user_code
                  verification_uri
          , hide: resetCode *> resetAccessToken
          , onHidden: case accessToken of
              RD.Success _ → props.onComplete
              _ → resetCode *> resetAccessToken
          }
      ]

renderInstructions ∷
  JSX →
  UserCode →
  VerificationURI →
  JSX
renderInstructions copyToClipboardButton user_code verification_uri =
  Block.box
    { css: background' col.backgroundLayer5 <> rounded3xl
        <> E.css { width: E.str "fit-content" }
        <> mT 24
        <> pB 36
        <> pX 42
        <> shadowXl
    }
    [ Block.centre
        { andText: true
        }
        [ Block.stack_
            [ Block.centre { css: E.css { width: E.str "fit-content" } }
                [ Block.box
                    { padding: E.str "20px"
                    , css: widthAndHeight 100 <> roundedFull
                        <> mT (-34)
                        <> background' col.highlight
                        <> textCol' col.highlightText
                        <> E.css
                          { "& > svg > path": E.nested
                              (E.css { strokeWidth: E.str "1.2" })
                          }
                    }
                    [ R.div'
                        </*
                          { css:
                              E.css
                                { animation: E.str
                                    "x 8s linear infinite"
                                , animationName: E.keyframes
                                    { from: E.css { opacity: E.num 0.7 }
                                    , "60%": E.css { opacity: E.num 0.3 }
                                    , to: E.css { opacity: E.num 0.7 }
                                    }
                                }
                          }
                        /> [ Heroicon.fingerPrint ]
                    ]
                ]
            , R.h1' </* { css: text4xl } /> [ R.text "Github Login" ]
            , Block.box_
                [ Block.stack {}
                    [ R.span'
                        </*
                          { css: textSm <> textCol' col.textPaler2
                          }
                        />
                          [ R.text $
                              "To complete your login to Github copy this code"
                          ]
                    , renderCode user_code
                    , copyToClipboardButton
                    , R.div'
                        </*
                          { css: textSm <> textCol' col.textPaler2
                          }
                        />
                          [ R.text "into the form at"

                          ]
                    , R.a'
                        </*
                          { css: textXl
                              <> underline
                              <> cursorPointer
                              -- <> shadowDefault
                              <> transition "all 0.5s ease"
                              <> hover (underline)
                              <> textCol' col.highlight
                              <> pX 24
                              <> pY 12
                          , target: "_blank"
                          , href: un VerificationURI
                              verification_uri
                          }
                        />
                          [ R.text $ un VerificationURI verification_uri ]

                    ]
                ]
            ]
        ]
    ]

mkCopyToClipboardButton ∷ UI.Component String
mkCopyToClipboardButton = UI.component "CopyToClipboardButton" \ctx toCopy →
  React.do
    copied /\ copyToClipboard /\ reset ← useCopyToClipboard ctx
    useAff copied do
      for_ copied \_ → do
        Aff.delay (5.0 # Seconds # fromDuration)
        reset # liftEffect
    pure $ Block.button
      { buttonType: ButtonStyle.Primary
      , css: shadowSm
      , onClick: handler_ (copyToClipboard toCopy)
      }
      [ Block.cluster
          { css: textCol' col.highlightText, space: "4px" }
          [ R.text "Copy to Clipboard"
          , P.div_
              ( width 22 <> height 18 <> mL 4 <> pL 4 <> borderLeft 1
                  <> borderCol' col.highlight
              )
              [ if copied # isJust then Heroicon.clipboardCheck
                else Heroicon.clipboard

              ]
          ]
      ]
  where
  useCopyToClipboard ctx = React.do
    res /\ send /\ reset ← useIPCMessage ctx
    let copyToClipboard text = send $ CopyToClipboard text
    let
      copiedToClipboard = unsafePartial case res # RD.toMaybe of
        Nothing → mempty
        Just (CopyToClipboardResult text) → Just text
    pure (copiedToClipboard /\ copyToClipboard /\ reset)

renderCode ∷ UserCode → JSX
renderCode user_code = Block.box_
  [ P.div_
      ( text3xl
          <> fontFamilyOrMono "Jetbrains Mono"
          <> textCol' col.text
          <> flexCol
          <> width' (E.str "fit-content")
          <> mXAuto
          <> justifyAround
          <> itemsCenter
          <> screenSm (flexRow <> gap 8)
      )
      ( ( ( clusters <#> \cluster →
              numberCluster (cluster # Array.mapWithIndex toLetter)
          ) # intersperse
            (P.span_ (textCol' col.textPaler3) [ R.text "-" ])
        )
      )
  ]
  where
  numberCluster = P.div_
    ( flexRow <> gap 4 <> justifyAround <> textCenter
    )

  toLetter i s = R.div'
    </*
      { key: show i <> s
      , css: pX 12 <> pY 4 <> border 1
          <> borderCol' col.backgroundBright5
          <> roundedXl
          <> shadowMd
          <> background' col.backgroundBright3
      }
    /> [ R.text s ]
  clusters = un UserCode user_code # String.split (String.Pattern "-")
    <#> toCodePointArray
    >>> (map (pure >>> String.fromCodePointArray))

githubButton ∷
  ∀ propsIn rest propsOut.
  Union propsOut rest Button.PropsNoChildren ⇒
  Lacks "children" propsOut ⇒
  Union propsIn (css ∷ E.Style, ripple ∷ String) propsOut ⇒
  Nub propsOut propsOut ⇒
  Record propsIn →
  Array JSX →
  JSX
githubButton props = Block.button
  ( props `disjointUnion`
      { css:
          background gray._800 <> textCol gray._100 <> shadowSm
            <> width 170
            <> E.css
              { "&:disabled, &:disabled:active":
                  E.nested $ E.css
                    { color: E.color gray._400
                    , boxShadow: E.none
                    , background: E.color gray._700
                    , transform: E.str "none"
                    }
              }
      , ripple: cssStringRGBA gray._600
      }
  )