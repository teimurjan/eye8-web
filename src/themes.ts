import color from 'color';

class DefaultTheme implements AdminUITheme, ClientUITheme {
  public danger = 'hsl(348, 100%, 61%)';
  public dark = 'hsl(0, 0%, 21%)';
  public info = 'hsl(204, 86%,  53%)';
  public primary = 'hsl(171, 100%, 41%)';
  public success = 'hsl(141, 71%,  48%)';
  public warning = 'hsl(48,  100%, 67%)';
  public white = '#fff';
  public greyDark = 'hsl(0, 0%, 29%)';
  public greyLight = 'hsl(0, 0%, 71%)';
  public light = 'hsl(0, 0%, 96%)';
  // V2
  public primaryColor = '#76bdae';
  public successColor = '#73a942';
  public infoColor = '#0077b6';
  public dangerColor = '#e71d36';
  public lightGrayColor = '#e5e5e5';
  // - border
  public borderColor = '#1e1e1c';
  public borderLightGrayColor = this.lightGrayColor;
  // - button
  // -- default
  public buttonDefaultColor = '#1e1e1c';
  public buttonDefaultBorderColor = this.borderColor;
  public buttonDefaultHoverColor = '#fff';
  public buttonDefaultBackgroundColor = '#fff';
  public buttonDefaultBackgroundHoverColor = '#1e1e1c';
  // -- dark
  public buttonDarkColor = '#fff';
  public buttonDarkBorderColor = this.borderColor;
  public buttonDarkHoverColor = '#1e1e1c';
  public buttonDarkBackgroundColor = '#1e1e1c';
  public buttonDarkBackgroundHoverColor = '#fff';
  // -- primary
  public buttonPrimaryBackgroundHoverColor = color(this.primaryColor)
    .darken(0.15)
    .hex();
  // -- info
  public buttonInfoBackgroundHoverColor = color(this.infoColor)
    .darken(0.15)
    .hex();
  // - background
  public backgroundPrimaryColor = '#fff';
  public backgroundPrimaryHoverColor = color(this.backgroundPrimaryColor)
    .darken(0.05)
    .hex();
  public backgroundDarkColor = '#000';
  public backgroundDarkHoverColor = '#222';
  public backgroundSecondaryColor = '#f0ebe3';
  public backgroundGrayColor = this.lightGrayColor;
  public backgroundDarkGrayColor = color(this.backgroundGrayColor)
    .darken(0.2)
    .hex();
  // - text
  public headerBackgroundColor = '#fff';
  public textColor = '#1e1e1c';
  public textFadedColor = color(this.lightGrayColor)
    .darken(0.1)
    .hex();
  public textSecondaryColor = '#606060';
  public textBrightColor = '#fff';
  public textOnDangerColor = color(this.dangerColor)
    .darken(0.2)
    .hex();
  public anchorColor = '#1e1e1c';
  // - tooltip
  public tooltipBackgroundColor = '#111';
  // - message
  public messageDefaultBackgroundColor = this.backgroundDarkGrayColor;
  public messageDefaultTextColor = this.textBrightColor;
  public messagePrimaryBackgroundColor = this.primaryColor;
  public messagePrimaryTextColor = this.textBrightColor;
  public messageDangerBackgroundColor = this.dangerColor;
  public messageDangerTextColor = this.textBrightColor;
}

export const defaultTheme = new DefaultTheme();
