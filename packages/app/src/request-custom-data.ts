import { IncomingMessage } from 'http';

import { Locale, Theme } from '@eye8/shared/utils';

interface Args {
  req?: Pick<IncomingMessage, '__CUSTOM_DATA__'>;
}

export const getRequestCustomData = ({ req }: Args = {}) => {
  const locale = req ? req.__CUSTOM_DATA__.locale : Locale.Primary;
  const localeDataScript = req ? req.__CUSTOM_DATA__.localeDataScript : '';
  const theme = req ? req.__CUSTOM_DATA__.theme : Theme.Light;

  return { locale, localeDataScript, theme };
};
