module Electron where

import Prelude

import Control.Promise (Promise, toAffE)
import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Uncurried (EffectFn2, runEffectFn2)
import Electron.Types (Channel)
import Foreign (Foreign)
import Node.Path (FilePath)
import Unsafe.Coerce (unsafeCoerce)
import Untagged.Castable (class Castable, cast)
import Untagged.Union (UndefinedOr)
import Web.Event.Event (EventType)
import Web.Event.EventTarget (EventListener, EventTarget)
import Yoga.JSON (class WriteForeign, write)

foreign import whenReadyImpl :: Effect (Promise Unit)

foreign import data BrowserWindow :: Type
type BrowserWindowConfig =
  { width :: Int
  , height :: Int
  , webPreferences ::
      { contextIsolation :: Boolean
      , enableRemoteModule :: Boolean
      , nodeIntegration :: Boolean
      , preload :: String
      , sandbox :: Boolean
      }
  }

foreign import newBrowserWindow :: BrowserWindowConfig -> Effect BrowserWindow

waitUntilAppReady :: Aff Unit
waitUntilAppReady = toAffE whenReadyImpl

foreign import loadFileImpl :: String -> BrowserWindow -> Effect (Promise Unit)

loadFile :: String -> BrowserWindow -> Aff Unit
loadFile s bw = toAffE (loadFileImpl s bw)

foreign import sendIPCRendererMessageImpl :: EffectFn2 Foreign Channel Unit

sendIPCRendererMessage
  :: forall msg. WriteForeign msg => msg -> Channel -> Effect Unit
sendIPCRendererMessage msg = runEffectFn2 sendIPCRendererMessageImpl
  (write msg)

foreign import onIPCMainMessage
  :: EventListener -> Channel -> Effect Unit

foreign import onIPCRendererMessage
  :: EventListener -> Channel -> Effect Unit

type OpenDialogOptions =
  { title :: UndefinedOr String
  , defaultPath :: UndefinedOr FilePath
  , buttonLabel :: UndefinedOr String
  , properties :: UndefinedOr (Array OpenDialogOptionsProperty)
  }

foreign import data OpenDialogOptionsProperty :: Type

openDirectory :: OpenDialogOptionsProperty
openDirectory = unsafeCoerce "openDirectory"

openFile :: OpenDialogOptionsProperty
openFile = unsafeCoerce "openFile"

type OpenDialogResult =
  { canceled :: Boolean, filePaths :: Array FilePath }

foreign import showOpenDialogImpl
  :: OpenDialogOptions -> BrowserWindow -> Effect (Promise OpenDialogResult)

showOpenDialog
  :: forall options
   . Castable options OpenDialogOptions
  => options
  -> BrowserWindow
  -> Aff OpenDialogResult
showOpenDialog options win = toAffE (showOpenDialogImpl (cast options) win)

foreign import sendToWebContentsImpl
  :: Foreign -> Channel -> BrowserWindow -> Effect Unit

sendToWebContents
  :: forall msg
   . WriteForeign msg
  => msg
  -> Channel
  -> BrowserWindow
  -> Effect Unit
sendToWebContents msg channel window =
  sendToWebContentsImpl (write msg) channel window

foreign import removeEventListener
  :: EventType
  -> EventListener
  -> BrowserWindow
  -> Effect Unit

foreign import data IPCRenderer :: Type
foreign import ipcRendererImpl :: IPCRenderer

ipcRenderer :: IPCRenderer
ipcRenderer = ipcRendererImpl

ipcRendererToEventTarget :: IPCRenderer -> EventTarget
ipcRendererToEventTarget = unsafeCoerce ipcRenderer