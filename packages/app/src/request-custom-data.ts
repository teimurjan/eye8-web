import { IncomingMessage } from 'http';

import { Locale, Theme } from '@eye8/shared/utils';

interface Args {
  req?: IncomingMessage;
}

export const getRequestCustomData = ({ req }: Args = {}) => {
  const locale = req ? req.__LOCALE__ : Locale.Primary;
  const localeDataScript = req ? req.__LOCALE_DATA_SCRIPT__ : '';
  const theme = req ? req.__THEME__ : Theme.Light;

  return { locale, localeDataScript, theme };
};
