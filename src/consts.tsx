export enum PLAYER_TYPE {
  OVP = 'ovp',
  OTT = 'ott',
  BASIC = 'basic',
}

export enum MEDIA_FORMAT {
  DASH = 'dash',
  HLS = 'hls',
  WVM = 'wvm',
  MP4 = 'mp4',
  MP3 = 'mp3',
  UDP = 'udp',
}

export enum MEDIA_ENTRY_TYPE {
  VOD = 'Vod',
  LIVE = 'Live',
  DVRLIVE = 'DvrLive',
}

export enum DRM_SCHEME {
  WIDEVINE_CENC = 'WidevineCENC',
  PLAYREADY_CENC = 'PlayReadyCENC',
  WIDEVINE_CENC_CLASSIC = 'WidevineClassic',
  PLAYREADY_CLASSIC = 'PlayReadyClassic',
}

export enum PLAYER_PLUGIN {
  IMA = 'ima',
  IMADAI = 'imadai',
  YOUBORA = 'youbora',
  KAVA = 'kava',
  OTT_ANALYTICS = 'ottAnalytics',
  BROADPEAK = 'broadpeak',
}

export enum PLAYER_RESIZE_MODES {
  FIT = 'fit',
  FIXED_WIDTH = 'fixedWidth',
  FIXED_HEIGHT = 'fixedHeight',
  FILL = 'fill',
  ZOOM = 'zoom',
}

export enum WAKEMODE {
  NONE = 'NONE',
  LOCAL = 'LOCAL',
  NETWORK = 'NETWORK',
}

/**
 * Subtitle Style Settings helper 
 * constants
 */
export enum SUBTITLE_STYLE {
  EDGE_TYPE_NONE = 'EDGE_TYPE_NONE',
  EDGE_TYPE_OUTLINE = 'EDGE_TYPE_OUTLINE',
  EDGE_TYPE_DROP_SHADOW = 'EDGE_TYPE_DROP_SHADOW',
  EDGE_TYPE_RAISED = 'EDGE_TYPE_RAISED',
  EDGE_TYPE_DEPRESSED = 'EDGE_TYPE_DEPRESSED',
  FRACTION_50 = 'SUBTITLE_FRACTION_50',
  FRACTION_75 = 'SUBTITLE_FRACTION_75',
  FRACTION_100 = 'SUBTITLE_FRACTION_100',
  FRACTION_125 = 'SUBTITLE_FRACTION_125',
  FRACTION_150 = 'SUBTITLE_FRACTION_150',
  FRACTION_200 = 'SUBTITLE_FRACTION_200',
  TYPEFACE_DEFAULT = 'DEFAULT',
  TYPEFACE_DEFAULT_BOLD = 'DEFAULT_BOLD',
  TYPEFACE_MONOSPACE = 'MONOSPACE',
  TYPEFACE_SERIF = 'SERIF',
  TYPEFACE_SANS_SERIF = 'SANS_SERIF',
  TYPEFACE_STYLE_NORMAL = 'NORMAL',
  TYPEFACE_STYLE_BOLD = 'BOLD',
  TYPEFACE_STYLE_ITALIC = 'ITALIC',
  TYPEFACE_STYLE_BOLD_ITALIC = 'BOLD_ITALIC',
  HORIZONTAL_ALIGNMENT_NORMAL = 'ALIGN_NORMAL',
  HORIZONTAL_ALIGNMENT_CENTER = 'ALIGN_CENTER',
  HORIZONTAL_ALIGNMENT_OPPOSITE = 'ALIGN_OPPOSITE',
}

export enum SUBTITLE_PREFERENCE {
  OFF = 'OFF',
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

export enum VIDEO_CODEC {
  HEVC = 'HEVC',
  AV1 = 'AV1',
  VP9 = 'VP9',
  VP8 = 'VP8',
  AVC = 'AVC',
}

export enum AUDIO_CODEC {
  AAC = 'AAC',
  AC3 = 'AC3',
  E_AC3 = 'E_AC3',
  OPUS = 'OPUS',
}

export enum VR_INTERACTION_MODE {
  MOTION = 'Motion',
  TOUCH = 'Touch',
  MOTION_WITH_TOUCH = 'MotionWithTouch',
  CARD_BOARD_MOTION = 'CardboardMotion',
  CARD_BOARD_MOTION_WITH_TOUCH = 'CardboardMotionWithTouch',
}
