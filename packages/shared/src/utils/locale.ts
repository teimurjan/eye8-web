export enum Locale {
  Primary = 'ru',
  Secondary = 'en',
}

export const availableLocales = [Locale.Primary, Locale.Secondary];

const nameOfLocale: { [key in Locale]: string } = {
  [Locale.Secondary]: 'English',
  [Locale.Primary]: 'Русский',
};

export const getLocaleName = (locale: Locale) => nameOfLocale[locale];
