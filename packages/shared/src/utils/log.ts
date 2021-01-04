enum FontColor {
  Red = '#85182a',
  Green = '#2c6e49',
  Blue = '#3d5a80',
}

enum BackgroundColor {
  Red = '#CDA2AB',
  Green = '#b8f2e6',
  Blue = '#e0fbfc',
}

enum Icon {
  Info = '🔵',
  Performance = '⏱️',
  Error = '🆘',
  Success = '✅',
}

type FormatSpecifier = '%s' | '%d' | '%f' | '%o' | '%O';

type LogOptions = {
  format?: FormatSpecifier;
};

const CONSTANT_STYLES = 'padding: 2.5px 5px; font-size: 14px;';

const logsEnabled = () => process.env.NODE_ENV !== 'production';

export const log = <T>({
  icon,
  message,
  style: { backgroundColor, fontColor },
  format = '%O',
}: {
  icon: Icon;
  message: T;
  style: { backgroundColor?: BackgroundColor; fontColor?: FontColor };
} & LogOptions) => {
  if (logsEnabled()) {
    console.log(
      `%c ${icon} ${format}`,
      `background: ${backgroundColor}; color: ${fontColor}; ${CONSTANT_STYLES}`,
      message,
    );
  }
};

export const logInfo = <T>(message: T, options: LogOptions = {}) => {
  log({
    icon: Icon.Info,
    message,
    style: { backgroundColor: BackgroundColor.Blue, fontColor: FontColor.Blue },
    ...options,
  });
};

export const logPerformance = <T>(message: T, options: LogOptions = {}) => {
  log({
    icon: Icon.Performance,
    message,
    style: { backgroundColor: BackgroundColor.Blue, fontColor: FontColor.Blue },
    ...options,
  });
};

export const logError = <T>(message: T, options: LogOptions = {}) => {
  log({
    icon: Icon.Error,
    message,
    style: { backgroundColor: BackgroundColor.Red, fontColor: FontColor.Red },
    ...options,
  });
};

export const logSuccess = <T>(message: T, options: LogOptions = {}) => {
  log({
    icon: Icon.Success,
    message,
    style: { backgroundColor: BackgroundColor.Green, fontColor: FontColor.Green },
    ...options,
  });
};

export const logTimeStart = (key: string) => {
  if (logsEnabled()) {
    console.time(key);
  }
};

export const logTimeFinish = (key: string) => {
  if (logsEnabled()) {
    console.timeEnd(key);
  }
};
