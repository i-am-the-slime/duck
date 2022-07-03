module UI.GithubLogin where

import Yoga.Prelude.View

import Biz.Github.Types (DeviceCodeResponse(..), UserCode(..), VerificationURI(..))
import Biz.OAuth.Types (GithubAccessToken)
import Color (cssStringRGBA)
import Control.Monad.Rec.Class (forever)
import Data.Array (intersperse)
import Data.Array as Array
import Data.Newtype (un)
import Data.String (toCodePointArray)
import Data.String as String
import Data.Time.Duration (fromDuration)
import Effect.Aff as Aff
import Fahrtwind (background, background', border, borderCol', cursorPointer, flexCol, flexRow, fontFamilyOrMono, gap, gray, hover, itemsCenter, justifyAround, justifyBetween, mB, mL, mT, mXAuto, pB, pX, pY, rounded3xl, roundedFull, roundedXl, screenSm, shadowMd, shadowSm, shadowXl, text3xl, text4xl, textCenter, textCol, textCol', textSm, textXl, transition, underline, width, width', widthAndHeight, widthFull)
import Fahrtwind.Icon.Heroicons as Heroicon
import Network.RemoteData (RemoteData(..))
import Network.RemoteData as RD
import Plumage.Util.HTML as P
import React.Basic.DOM as R
import React.Basic.Emotion as E
import React.Basic.Hooks as React
import React.Basic.Hooks.Aff (useAff)
import Record (disjointUnion)
import UI.Component as UI
import UI.Container (modalClickawayId, modalContainerId)
import UI.GithubLogin.GithubLogo (githubLogo)
import UI.Hook.UseRemoteData (useRemoteData)
import UI.Modal (mkModalView)
import UI.Notification.ErrorNotification (errorNotification)
import UI.Notification.SendNotification (sendNotification)
import Yoga.Block as Block
import Yoga.Block.Container.Style (col)

type Props =
  { setToken ∷ Maybe GithubAccessToken → Effect Unit
  , tokenʔ ∷ Maybe GithubAccessToken
  }

mkGithubLogin ∷ UI.Component Props
mkGithubLogin = do
  modalView ← mkModalView { clickAwayId: modalClickawayId, modalContainerId } #
    liftEffect
  UI.component "GithubLoginButton" \ctx (props ∷ Props) → React.do
    let
      { getDeviceCode, pollAccessToken } = ctx.githubAuth
      notifyError message = sendNotification ctx $
        errorNotification { title: "Error", body: R.text message }
    code ← useRemoteData (\_ → getDeviceCode)
    let codeʔ = RD.toMaybe code.data

    useAff codeʔ do
      for_ codeʔ \(DeviceCodeResponse { expires_in }) → do
        Aff.delay (expires_in # fromDuration)
        code.load unit # liftEffect

    useAff codeʔ do
      for_ codeʔ \(DeviceCodeResponse { interval, device_code }) → forever do
        Aff.delay (interval # fromDuration)
        result ← pollAccessToken device_code
        liftEffect $ case result of
          Left err → notifyError (show err)
          Right (Left { error }) | error == "authorization_pending" → mempty
          Right (Left error) → notifyError (show error)
          Right (Right token) → do
            props.setToken $ Just token

    useEffect code.data do
      case code.data of
        Failure err → notifyError err
        _ → mempty
      mempty

    let
      buttonGithubLogo =
        P.div_ (mL 8 <> widthAndHeight 16 <> mB 1) [ githubLogo ]
      logoutButton =
        githubButton
          { onClick: handler_ (props.setToken Nothing) }
          [ P.div_ (flexRow <> justifyBetween <> widthFull <> itemsCenter)
              [ R.div_ [ R.text "Log out of Github" ]
              , buttonGithubLogo
              ]
          ]

      loginButton { disabled } =
        githubButton
          { disabled
          , onClick: handler_ (code.load unit)
          }
          [ P.div_ (flexRow <> justifyBetween <> widthFull <> itemsCenter)
              [ R.div_ [ R.text "Login to Github" ]
              , buttonGithubLogo
              ]
          ]

      loggedInView = logoutButton

      loggedOutView = case code.data of
        NotAsked → loginButton { disabled: false }
        Loading → loginButton { disabled: true }
        Failure _ → loginButton { disabled: false }
        Success _ → fragment
          [ loginButton { disabled: true }
          ]

    pure $ fragment
      [ if isJust props.tokenʔ then
          loggedInView
        else
          loggedOutView
      , modalView
          { childʔ: codeʔ <#>
              \(DeviceCodeResponse { user_code, verification_uri }) →
                renderInstructions user_code verification_uri
          , hide: code.reset
          }
      ]

renderInstructions ∷
  UserCode → VerificationURI → JSX
renderInstructions user_code verification_uri =
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
                              "To complete your login to Github, visit"
                          ]
                    , R.a'
                        </*
                          { css: textXl
                              <> underline
                              <> cursorPointer
                              <> roundedFull
                              -- <> shadowDefault
                              <> background' col.backgroundBright3
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
            , R.div'
                </*
                  { css: textSm <> textCol' col.textPaler2
                  }
                />
                  [ R.text "and enter the following code" ]
            , renderCode user_code
            ]
        ]
    ]

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

githubButton props = Block.button $ props `disjointUnion`
  { css: background gray._800 <> textCol gray._100 <> shadowSm
      <> width 170
      <>
        E.css
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
