import { IIntlListResponseItem } from 'src/api/IntlAPI';

// Takes a raw intl field with locale IDs as keys and transform to the object where the keys are locale names
// { 1: 'English Name' } => { 'en': 'English Name' }
export const extendIntlTextWithLocaleNames = (
  intlText: { [key: string]: string },
  availableLocales: IIntlListResponseItem[],
) =>
  Object.keys(intlText).reduce((acc, languageId) => {
    const locale = availableLocales.find(({ id }) => id === parseInt(languageId, 10));
    if (locale) {
      return {
        ...acc,
        [locale.name]: intlText[languageId],
      };
    }

    return acc;
  }, {});
