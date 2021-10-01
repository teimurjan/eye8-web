import { Locale } from '@eye8/shared/utils';

export const getFieldName = (key: string, locale: Locale): string => `${key}-${locale}`;
export const parseFieldName = (fieldName: string): { locale: string; key: string } => {
  const splittedFieldName = fieldName.split('-');
  return {
    locale: splittedFieldName.pop() ?? '',
    key: splittedFieldName.shift() ?? '',
  };
};
