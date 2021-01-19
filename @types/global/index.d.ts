declare interface AdminUITheme {
  primary: string;
  light: string;
  white: string;
  dark: string;
  danger: string;
  greyLight: string;
  greyDark: string;
  info: string;
  success: string;
  warning: string;
}

declare interface ClientUITheme {
  headerBackgroundColor: string;
  borderColor: string;
  borderLightGrayColor: string;
  buttonDefaultColor: string;
  buttonDefaultBorderColor: string;
  buttonDefaultHoverColor: string;
  buttonDefaultBackgroundColor: string;
  buttonDefaultBackgroundHoverColor: string;
  buttonDarkColor: string;
  buttonDarkBorderColor: string;
  buttonDarkHoverColor: string;
  buttonDarkBackgroundColor: string;
  buttonDarkBackgroundHoverColor: string;
  anchorColor: string;
  backgroundPrimaryColor: string;
  backgroundSecondaryColor: string;
  textColor: string;
  textOnDangerColor: string;
  textFadedColor: string;
  textSecondaryColor: string;
  primaryColor: string;
  textBrightColor: string;
  dangerColor: string;
  successColor: string;
  tooltipBackgroundColor: string;
  buttonPrimaryBackgroundHoverColor: string;
  backgroundPrimaryHoverColor: string;
  backgroundDarkColor: string;
  backgroundDarkHoverColor: string;
  backgroundGrayColor: string;
  backgroundSelectedColor: string;
  infoColor: string;
  buttonInfoBackgroundHoverColor: string;
  messageDefaultBackgroundColor: string;
  messageDefaultTextColor: string;
  messagePrimaryBackgroundColor: string;
  messagePrimaryTextColor: string;
  messageDangerBackgroundColor: string;
  messageDangerTextColor: string;
  toggleBackgroundColor: string;
  toggleDotColor: string;
  toggleGrayBackgroundColor: string;
  toggleGrayDotColor: string;
  thumbColor: string;
  thumbBackgroundColor: string;
  modalBackgroundColor: string;
}

declare type Then<T> = T extends PromiseLike<infer U> ? U : T;

interface Window {
  __NEXT_DATA__: { props: object };
  __MESSAGES__: Record<string, string>;
  __DATA__: { rates: object; categories: object };
  __LOCALE__: string;
}

declare module 'http' {
  interface IncomingMessage {
    __CUSTOM_DATA__: {
      theme: string;
      locale: string;
      localeDataScript: string;
    };
  }
}

interface SvgrComponent extends React.StatelessComponent<React.SVGAttributes<SVGElement>> {}

declare module '*.svg' {
  const value: SvgrComponent;
  export default value;
}
