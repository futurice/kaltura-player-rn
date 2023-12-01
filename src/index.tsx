import { requireNativeComponent, NativeModules, ViewStyle } from 'react-native';
import { PlayerEvents } from './events/PlayerEvents';
import { AdEvents } from './events/AdEvents';
import { AnalyticsEvents } from './events/AnalyticsEvents';
import {
  PLAYER_TYPE,
  MEDIA_FORMAT,
  MEDIA_ENTRY_TYPE,
  DRM_SCHEME,
  PLAYER_PLUGIN,
  PLAYER_RESIZE_MODES,
  WAKEMODE,
  SUBTITLE_STYLE,
  SUBTITLE_PREFERENCE,
  VIDEO_CODEC,
  AUDIO_CODEC,
  VR_INTERACTION_MODE,
  LOG_LEVEL,
} from './consts';

export {
  PlayerEvents,
  AdEvents,
  AnalyticsEvents,
  PLAYER_TYPE,
  MEDIA_FORMAT,
  MEDIA_ENTRY_TYPE,
  DRM_SCHEME,
  PLAYER_PLUGIN,
  PLAYER_RESIZE_MODES,
  WAKEMODE,
  SUBTITLE_STYLE,
  SUBTITLE_PREFERENCE,
  VIDEO_CODEC,
  AUDIO_CODEC,
  VR_INTERACTION_MODE,
  LOG_LEVEL,
};

const { KalturaPlayerModule } = NativeModules;

const POSITION_UNSET: number = -1;
var debugLogs = false;

interface KalturaPlayerProps {
  style: ViewStyle;
}

export const KalturaPlayer =
  requireNativeComponent<KalturaPlayerProps>('KalturaPlayerView');

export class KalturaPlayerAPI {
  /**
   * This method creates a Player instance internally (Basic, OVP/OTT Player)
   * With this, it take the PlayerInitOptions which are having essential Player settings values
   *
   * @param playerType The Player Type, Basic/OVP/OTT.
   * @param options PlayerInitOptions JSON String.
   * @param id PartnerId (Don't pass this parameter for BasicPlayer. For OVP/OTT player this value
   * should be always greater than 0 and should be valid otherwise, we will not be able to featch the details
   * for the mediaId or the entryId)
   */
  static setup = async (
    playerType: PLAYER_TYPE,
    options: string,
    id: number = 0
  ) => {
    if (playerType == null) {
      printConsoleLog(`Invalid playerType = ${playerType}`, LogType.ERROR);
      return;
    }

    if (!options && playerType != PLAYER_TYPE.BASIC) {
      printConsoleLog(`setup, invalid options = ${options}`, LogType.ERROR);
      return;
    }
    printConsoleLog('Setting up the Player');
    return await setupKalturaPlayer(playerType, options, id);
  };

  /**
   * Load the media with the given
   *
   * assetId OR mediaId OR entryID for OVP/OTT Kaltura Player
   *
   * playbackURL for Basic Kaltura Player
   *
   * @param id Playback URL for Kaltura Basic Player OR
   * MediaId for Kaltura OTT Player OR
   * EntryId for Kaltura OVP Player
   * @param asset Media Asset JSON String
   */
  static loadMedia = async (id: string, asset: string) => {
    if (!id) {
      printConsoleLog(`loadMedia, invalid id = ${id}`, LogType.ERROR);
      return;
    }

    printConsoleLog(
      `Loading the media. assetId is: ${id} and media asset is: ${asset}`
    );

    return await loadMediaKalturaPlayer(id, asset);
  };

  /**
   * Adds the Native Player View to the Player if not attached
   * Ideally this API should be called after calling {@link removePlayerView}
   */
  static addPlayerView = () => {
    printConsoleLog('Calling Native method addPlayerView()');
    KalturaPlayerModule.addPlayerView();
  };

  /**
   * Removes the Native Player View from the Player if it is attached
   * Ideally this API should be called after calling {@link addPlayerView}
   */
  static removePlayerView = () => {
    printConsoleLog('Calling Native method removePlayerView()');
    KalturaPlayerModule.removePlayerView();
  };

  /**
   * Add the listners for the Kaltura Player
   */
  static addListeners = () => {
    printConsoleLog('Calling Native method addListeners()');
    KalturaPlayerModule.addKalturaPlayerListeners();
  };

  /**
   * Add the listners for the Kaltura Player
   */
  static removeListeners = () => {
    printConsoleLog('Calling Native method removeListeners()');
    KalturaPlayerModule.removeKalturaPlayerListeners();
  };

  /**
   * Should be called when the application is in background
   */
  static onApplicationPaused = () => {
    printConsoleLog('Calling Native method onApplicationPaused()');
    KalturaPlayerModule.onApplicationPaused();
  };

  /**
   * Should be called when the application comes back to
   * foreground
   */
  static onApplicationResumed = () => {
    printConsoleLog('Calling Native method onApplicationResumed()');
    KalturaPlayerModule.onApplicationResumed();
  };

  /**
   * Update Plugin Configs
   *
   * @param configs Updated Plugin Configs (YouboraConfig JSON, IMAConfig JSON etc)
   */
  static updatePluginConfigs = (configs: object) => {
    if (!configs) {
      printConsoleLog(
        `updatePluginConfig, config is invalid: ${configs}`,
        LogType.ERROR
      );
      return;
    }

    const stringifiedJson = JSON.stringify(configs);
    printConsoleLog(`Updated Plugin is: ${stringifiedJson}`);

    KalturaPlayerModule.updatePluginConfigs(stringifiedJson);
  };

  /**
   * Play the player if it is not playing
   */
  static play = () => {
    printConsoleLog('Calling Native method play()');
    KalturaPlayerModule.play();
  };

  /**
   * Pause the player if it is playing
   */
  static pause = () => {
    printConsoleLog('Calling Native method pause()');
    KalturaPlayerModule.pause();
  };

  /**
   * Stops the player to the initial state
   */
  static stop = () => {
    printConsoleLog('Calling Native method stop()');
    KalturaPlayerModule.stop();
  };

  /**
   * Destroy the Kaltura Player instance
   */
  static destroy = () => {
    printConsoleLog('Calling Native method destroy()');
    KalturaPlayerModule.destroy();
  };

  /**
   * Replays the media from the beginning
   */
  static replay = () => {
    printConsoleLog('Calling Native method replay()');
    KalturaPlayerModule.replay();
  };

  /**
   * Seek the player to the specified position
   * @param position in miliseconds (Ms)
   */
  static seekTo = (position: number) => {
    printConsoleLog(`Calling Native method seekTo() position is: ${position}`);
    KalturaPlayerModule.seekTo(position);
  };

  /**
   * Change a specific track (Video, Audio or Text track)
   * @param trackId Unique track ID which was sent in `tracksAvailable` event
   */
  static changeTrack = (trackId: string) => {
    if (!trackId) {
      printConsoleLog(`trackId is invalid which is: ${trackId}`, LogType.ERROR);
      return;
    }
    printConsoleLog('Calling Native method changeTrack()');
    KalturaPlayerModule.changeTrack(trackId);
  };

  /**
   * Change the playback rate (ff or slow motion). Default is 1.0f
   * @param rate Desired playback rate (Ex: 0.5f, 1.5f 2.0f etc)
   */
  static setPlaybackRate = (rate: number) => {
    printConsoleLog(`Calling Native method setPlaybackRate() rate is: ${rate}`);
    KalturaPlayerModule.changePlaybackRate(rate);
  };

  /**
   * Change the volume of the current audio track.
   * Accept values between 0.0 and 1.0. Where 0.0 is mute and 1.0 is maximum volume.
   * If the volume parameter is higher then 1.0, it will be converted to 1.0.
   * If the volume parameter is lower then 0.0, it be converted to 0.0.
   *
   * @param vol - volume to set.
   */
  static setVolume = (vol: number) => {
    printConsoleLog('Calling Native method setVolume()');
    KalturaPlayerModule.setVolume(vol);
  };

  /**
   * Set the media to play automatically at the start (load)
   * if `false`, user will have to click on UI play button
   *
   * @param isAutoPlay media should be autoplayed at the start or not
   */
  static setAutoPlay = (isAutoPlay: boolean) => {
    printConsoleLog('Calling Native method setAutoPlay()');
    KalturaPlayerModule.setAutoplay(isAutoPlay);
  };

  /**
   * Set the KS for the media (only for OVP/OTT users)
   * Call this before calling {@link loadMedia}
   * @param KS Kaltura Secret key
   */
  static setKS = (KS: string) => {
    if (!KS) {
      printConsoleLog('KS is invalid which is: ' + KS, LogType.ERROR);
      return;
    }
    printConsoleLog('Calling Native method setKS()');
    KalturaPlayerModule.setKS(KS);
  };

  /**
   * NOOP
   * @param index
   */
  //static setZIndex = (index: number) => {
  //  printConsoleLog('Calling Native method setZIndex()');
  //};

  /**
   * Only for Live Media.
   * Seek player to Live Default Position.
   */
  static seekToLiveDefaultPosition = () => {
    printConsoleLog('Calling Native method seekToLiveDefaultPosition()');
    KalturaPlayerModule.seekToLiveDefaultPosition();
  };

  /**
   * Update the existing subtitle styling
   */
  static updateSubtitleStyle = (subtitleStyle: string) => {
    if (!subtitleStyle) {
      printConsoleLog(
        `subtitleStyle is invalid which is: ${subtitleStyle}`,
        LogType.ERROR
      );
      return;
    }
    printConsoleLog('Calling Native method updateSubtitleStyle()');
    KalturaPlayerModule.updateSubtitleStyle(subtitleStyle);
  };

  /**
   * Update the Resize Mode
   */
  static updateResizeMode = (mode: PLAYER_RESIZE_MODES) => {
    printConsoleLog(
      'Calling Native method updateSurfaceAspectRatioResizeMode()'
    );
    KalturaPlayerModule.updateResizeMode(mode);
  };

  /**
   * Update the ABR Settings
   */
  static updateAbrSettings = (abrSettings: string) => {
    if (!abrSettings) {
      printConsoleLog(
        `abrSettings is invalid which is: ${abrSettings}`,
        LogType.ERROR
      );
      return;
    }
    printConsoleLog('Calling Native method updateABRSettings()');
    KalturaPlayerModule.updateAbrSettings(abrSettings);
  };

  /**
   * Reset the ABR Settings
   */
  static resetAbrSettings = () => {
    printConsoleLog('Calling Native method resetABRSettings()');
    KalturaPlayerModule.resetAbrSettings();
  };

  /**
   * Update the Low Latency Config
   * Only for Live Media
   */
  static updateLowLatencyConfig = (lowLatencyConfig: string) => {
    if (!lowLatencyConfig) {
      printConsoleLog(
        `lowLatencyConfig is invalid which is: ${lowLatencyConfig}`,
        LogType.ERROR
      );
      return;
    }
    printConsoleLog('Calling Native method updateLowLatencyConfig()');
    KalturaPlayerModule.updateLLConfig(lowLatencyConfig);
  };

  /**
   * Reset the Low Latency Config
   * Only for Live Media
   */
  static resetLowLatencyConfig = () => {
    printConsoleLog('Calling Native method resetLowLatencyConfig()');
    KalturaPlayerModule.resetLLConfig();
  };

  /**
   * Get the current playback position for Content and Ad
   * @returns number: Position of the player or {@link POSITION_UNSET}
   */
  static getCurrentPosition = async () => {
    printConsoleLog('Calling Native method getCurrentPosition()');
    return await getCurrentPosition();
  };

  /**
   * Checks if Player is currently playing or not
   * @returns boolean
   */
  static isPlaying = async () => {
    printConsoleLog('Calling Native method isPlaying');
    return await isPlaying();
  };

  /**
   * Checks if the stream is Live or Not
   * @returns boolean
   */
  static isLive = async () => {
    printConsoleLog('Calling Native method isLive');
    return await isLive();
  };

  /**
   * Get the Information for a thumbnail image by position.
   *
   * @param positionMs - relevant image for given player position.
   * @returns ThumbnailInfo JSON object
   */
  static requestThumbnailInfo = async (positionMs: number) => {
    printConsoleLog('requestThumbnailInfo');
    if (positionMs < 0) {
      printConsoleLog(`Invalid positionMs = ${positionMs}`, LogType.ERROR);
      return;
    }
    return await getThumbnailInfo(positionMs);
  };

  /**
   * Enable the console logs for the JS bridge and Player.
   * By default it is disabled.
   *
   * For logLevel options {@link LOG_LEVEL}
   *
   * @param enabled enable the debug logs. Just set it to `false` to disable all the logs.
   * @param logLevel Default is `LOG_LEVEL.DEBUG` if set to `LOG_LEVEL.OFF` will turn off the logs.
   *
   * @returns if `enabled` is `null` then don't do anything
   */
  static enableDebugLogs = (
    enabled: boolean,
    logLevel: LOG_LEVEL = LOG_LEVEL.DEBUG
  ) => {
    if (enabled == null || logLevel == null) {
      return;
    }

    debugLogs = enabled;

    if (debugLogs === false || logLevel == LOG_LEVEL.OFF) {
      debugLogs = false;
      KalturaPlayerModule.setLogLevel(LOG_LEVEL.OFF);
    } else {
      KalturaPlayerModule.setLogLevel(logLevel);
    }
  };
}

async function setupKalturaPlayer(
  playerType: PLAYER_TYPE,
  options: string,
  id: number
) {
  try {
    const kalturaPlayerSetup = await KalturaPlayerModule.setUpPlayer(
      playerType,
      id,
      options
    );
    printConsoleLog(`Player is created: ${kalturaPlayerSetup}`);
    return kalturaPlayerSetup;
  } catch (exception) {
    printConsoleLog(
      `setupKalturaPlayer Exception: ${exception}`,
      LogType.ERROR
    );
    return Promise.reject(exception);
  }
}

async function loadMediaKalturaPlayer(id: string, asset: string) {
  try {
    const loadMedia = await KalturaPlayerModule.load(id, asset);
    printConsoleLog(`Media Loaded ${loadMedia}`);
    return loadMedia;
  } catch (exception) {
    printConsoleLog(
      `loadMediaKalturaPlayer Exception: ${exception}`,
      LogType.ERROR
    );
    return Promise.reject(exception);
  }
}

async function getCurrentPosition() {
  try {
    const currentPosition = await KalturaPlayerModule.getCurrentPosition();
    printConsoleLog(`Current Position: ${currentPosition}`);
    return currentPosition;
  } catch (exception) {
    printConsoleLog(`Exception: ${exception}`, LogType.ERROR);
    return POSITION_UNSET;
  }
}

async function isPlaying() {
  try {
    const isPlayerPlaying = await KalturaPlayerModule.isPlaying();
    printConsoleLog(`isPlayerPlaying ${isPlayerPlaying}`);
    return isPlayerPlaying;
  } catch (exception) {
    printConsoleLog(`Exception: ${exception}`, LogType.ERROR);
    return false;
  }
}

async function isLive() {
  try {
    const isPlayerLive = await KalturaPlayerModule.isLive();
    printConsoleLog(`isPlayerLive ${isPlayerLive}`);
    return isPlayerLive;
  } catch (exception) {
    printConsoleLog(`Exception: ${exception}`, LogType.ERROR);
    return false;
  }
}

async function getThumbnailInfo(position: number) {
  try {
    const thumbnailInfo = await KalturaPlayerModule.requestThumbnailInfo(
      position
    );
    printConsoleLog(`getThumbnailInfo ${JSON.stringify(thumbnailInfo)}`);
    return thumbnailInfo;
  } catch (exception) {
    printConsoleLog(`Exception: ${exception}`, LogType.ERROR);
    return Promise.reject(exception);
  }
}

function printConsoleLog(message: String, logType: LogType = LogType.LOG) {
  if (debugLogs) {
    switch (logType) {
      case LogType.LOG: {
        console.log(message);
        break;
      }
      case LogType.WARN: {
        console.warn(message);
        break;
      }
      case LogType.ERROR: {
        console.error(message);
        break;
      }
      default: {
        console.log(message);
      }
    }
  }
}

enum LogType {
  LOG,
  WARN,
  ERROR,
}
