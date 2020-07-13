import color from 'color';

export const defaultTheme: AdminUITheme & ClientUITheme = {
  danger: 'hsl(348, 100%, 61%)',
  dark: 'hsl(0, 0%, 21%)',
  info: 'hsl(204, 86%,  53%)',
  primary: 'hsl(171, 100%, 41%)',
  success: 'hsl(141, 71%,  48%)',
  warning: 'hsl(48,  100%, 67%)',
  white: '#fff',
  greyDark: 'hsl(0, 0%, 29%)',
  greyLight: 'hsl(0, 0%, 71%)',
  light: 'hsl(0, 0%, 96%)',
  // V2
  primaryColor: '#76bdae',
  successColor: '#73a942',
  infoColor: '#0077b6',
  dangerColor: '#e71d36',
  borderColor: '#1e1e1c',
  // - buttons
  // -- default
  buttonDefaultColor: '#1e1e1c',
  buttonDefaultBorderColor: '#1e1e1c',
  buttonDefaultHoverColor: '#fff',
  buttonDefaultBackgroundColor: '#fff',
  buttonDefaultBackgroundHoverColor: '#1e1e1c',
  // -- dark
  buttonDarkColor: '#fff',
  buttonDarkBorderColor: '#1e1e1c',
  buttonDarkHoverColor: '#1e1e1c',
  buttonDarkBackgroundColor: '#1e1e1c',
  buttonDarkBackgroundHoverColor: '#fff',
  // -- primary
  buttonPrimaryBackgroundHoverColor: color('#76bdae')
    .darken(0.15)
    .hex(),
  // -- info
  buttonInfoBackgroundHoverColor: color('#0077b6')
    .darken(0.15)
    .hex(),
  // - backgrounds
  backgroundPrimaryColor: '#fff',
  backgroundPrimaryHoverColor: color('#fff')
    .darken(0.05)
    .hex(),
  backgroundDarkColor: '#000',
  backgroundDarkHoverColor: '#222',
  backgroundSecondaryColor: '#f0ebe3',
  backgroundDangerColor: color('#e71d36')
    .lighten(0.8)
    .hex(),
  backgroundGrayColor: '#e5e5e5',
  // - texts
  headerBackgroundColor: '#fff',
  textColor: '#1e1e1c',
  textFadedColor: color('#e5e5e5')
    .darken(0.1)
    .hex(),
  textSecondaryColor: '#606060',
  textBrightColor: '#fff',
  textOnDangerColor: color('#e71d36')
    .darken(0.2)
    .hex(),
  anchorColor: '#1e1e1c',
  tooltipBackgroundColor: '#111',
};
