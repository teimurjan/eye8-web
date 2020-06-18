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

const CONSTANT_STYLES = 'padding: 2.5px 5px; font-size: 14px;';

export const log = ({
  message,
  style: { backgroundColor, fontColor },
}: {
  message: any;
  style: { backgroundColor?: BackgroundColor; fontColor?: FontColor };
}) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`%c${message}`, `background: ${backgroundColor}; color: ${fontColor}; ${CONSTANT_STYLES}`);
  }
};

export const logInfo = (message: any) => {
  log({ message: `🔵 ${message}`, style: { backgroundColor: BackgroundColor.Blue, fontColor: FontColor.Blue } });
};

export const logError = (message: any) => {
  log({ message: `🆘 ${message}`, style: { backgroundColor: BackgroundColor.Red, fontColor: FontColor.Red } });
};

export const logSuccess = (message: any) => {
  log({ message: `✅ ${message}`, style: { backgroundColor: BackgroundColor.Green, fontColor: FontColor.Green } });
};
