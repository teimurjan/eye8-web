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
  // Client
  // const
  public primaryColor = '#76bdae';
  public successColor = '#73a942';
  public infoColor = '#0077b6';
  public dangerColor = '#e71d36';
  // dynamic
  public lightGrayColor = '#e5e5e5';
  public grayColor = '#606060';
  public whiteColor = '#fff';
  public darkGrayColor = '#1e1e1c';
  public blackColor = '#000';
  public lightBlackColor = '#111';
  public beigeColor = '#f0ebe3';
  // - border
  public borderColor = this.darkGrayColor;
  public borderLightGrayColor = this.lightGrayColor;
  // - button
  // -- default
  public buttonDefaultColor = this.darkGrayColor;
  public buttonDefaultBorderColor = this.borderColor;
  public buttonDefaultHoverColor = this.whiteColor;
  public buttonDefaultBackgroundColor = this.whiteColor;
  public buttonDefaultBackgroundHoverColor = this.darkGrayColor;
  // -- dark
  public buttonDarkColor = this.whiteColor;
  public buttonDarkBorderColor = this.borderColor;
  public buttonDarkHoverColor = this.darkGrayColor;
  public buttonDarkBackgroundColor = this.darkGrayColor;
  public buttonDarkBackgroundHoverColor = this.whiteColor;
  // -- primary
  public buttonPrimaryBackgroundHoverColor = color(this.primaryColor).darken(0.15).hex();
  // -- info
  public buttonInfoBackgroundHoverColor = color(this.infoColor).darken(0.15).hex();
  // - background
  public backgroundPrimaryColor = this.whiteColor;
  public backgroundPrimaryHoverColor = color(this.backgroundPrimaryColor).darken(0.05).hex();
  public backgroundDarkColor = this.blackColor;
  public backgroundDarkHoverColor = this.darkGrayColor;
  public backgroundSecondaryColor = this.beigeColor;
  public backgroundGrayColor = this.lightGrayColor;
  public backgroundDarkGrayColor = color(this.backgroundGrayColor).darken(0.2).hex();
  public backgroundSelectedColor = color(this.primaryColor).lighten(0.55).hex();
  // - text
  public headerBackgroundColor = this.whiteColor;
  public textColor = this.darkGrayColor;
  public textFadedColor = color(this.lightGrayColor).darken(0.1).hex();
  public textSecondaryColor = this.grayColor;
  public textBrightColor = this.whiteColor;
  public textOnDangerColor = color(this.dangerColor).darken(0.2).hex();
  public anchorColor = this.darkGrayColor;
  // - tooltip
  public tooltipBackgroundColor = this.lightBlackColor;
  // - message
  public messageDefaultBackgroundColor = this.backgroundDarkGrayColor;
  public messageDefaultTextColor = this.textBrightColor;
  public messagePrimaryBackgroundColor = this.primaryColor;
  public messagePrimaryTextColor = this.textBrightColor;
  public messageDangerBackgroundColor = this.dangerColor;
  public messageDangerTextColor = this.textBrightColor;
  // - toggle
  public toggleBackgroundColor = this.whiteColor;
  public toggleDotColor = this.darkGrayColor;
  public toggleGrayBackgroundColor = this.whiteColor;
  public toggleGrayDotColor = this.grayColor;
  // - thumb
  public thumbColor = color(this.lightGrayColor).darken(0.3).hex();
  public thumbBackgroundColor = this.lightGrayColor;
  // - modal
  public modalBackgroundColor = 'rgba(10,10,10,.86)';
}

class DarkTheme implements AdminUITheme, ClientUITheme {
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
  // Client
  // const
  public primaryColor = '#76bdae';
  public successColor = '#73a942';
  public infoColor = '#0077b6';
  public dangerColor = '#e71d36';
  // dynamic
  public lightGrayColor = color('#e5e5e5').negate().hex();
  public grayColor = color('#606060').negate().hex();
  public whiteColor = '#303030';
  public darkGrayColor = color('#1e1e1c').negate().hex();
  public blackColor = color('#000').negate().hex();
  public lightBlackColor = color('#111').negate().hex();
  public beigeColor = '#464646';
  // - border
  public borderColor = this.darkGrayColor;
  public borderLightGrayColor = this.lightGrayColor;
  // - button
  // -- default
  public buttonDefaultColor = this.darkGrayColor;
  public buttonDefaultBorderColor = this.borderColor;
  public buttonDefaultHoverColor = this.whiteColor;
  public buttonDefaultBackgroundColor = this.whiteColor;
  public buttonDefaultBackgroundHoverColor = this.darkGrayColor;
  // -- dark
  public buttonDarkColor = this.whiteColor;
  public buttonDarkBorderColor = this.borderColor;
  public buttonDarkHoverColor = this.darkGrayColor;
  public buttonDarkBackgroundColor = this.darkGrayColor;
  public buttonDarkBackgroundHoverColor = this.whiteColor;
  // -- primary
  public buttonPrimaryBackgroundHoverColor = color(this.primaryColor).darken(0.15).hex();
  // -- info
  public buttonInfoBackgroundHoverColor = color(this.infoColor).darken(0.15).hex();
  // - background
  public backgroundPrimaryColor = this.whiteColor;
  public backgroundPrimaryHoverColor = color(this.backgroundPrimaryColor).darken(0.05).hex();
  public backgroundDarkColor = this.blackColor;
  public backgroundDarkHoverColor = this.darkGrayColor;
  public backgroundSecondaryColor = this.beigeColor;
  public backgroundGrayColor = this.lightGrayColor;
  public backgroundDarkGrayColor = color(this.backgroundGrayColor).darken(0.2).hex();
  public backgroundSelectedColor = color(this.primaryColor).lighten(0.5).hex();
  // - text
  public headerBackgroundColor = this.whiteColor;
  public textColor = this.darkGrayColor;
  public textFadedColor = color(this.lightGrayColor).darken(0.1).hex();
  public textSecondaryColor = this.grayColor;
  public textBrightColor = this.whiteColor;
  public textOnDangerColor = color(this.dangerColor).darken(0.2).hex();
  public anchorColor = this.darkGrayColor;
  // - tooltip
  public tooltipBackgroundColor = this.lightBlackColor;
  // - message
  public messageDefaultBackgroundColor = this.backgroundDarkGrayColor;
  public messageDefaultTextColor = this.textBrightColor;
  public messagePrimaryBackgroundColor = this.primaryColor;
  public messagePrimaryTextColor = this.textBrightColor;
  public messageDangerBackgroundColor = this.dangerColor;
  public messageDangerTextColor = this.textBrightColor;
  // - toggle
  public toggleBackgroundColor = this.whiteColor;
  public toggleDotColor = this.darkGrayColor;
  public toggleGrayBackgroundColor = this.whiteColor;
  public toggleGrayDotColor = this.grayColor;
  // - thumb
  public thumbColor = this.grayColor;
  public thumbBackgroundColor = this.lightGrayColor;
  // - modal
  public modalBackgroundColor = 'rgba(10,10,10,.86)';
}

export const defaultTheme = new DefaultTheme();
export const darkTheme = new DarkTheme();
