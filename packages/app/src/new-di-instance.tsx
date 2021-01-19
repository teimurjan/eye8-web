import React from 'react';

import { DIFactory } from '@eye8/di';
import { getGlobal } from '@eye8/shared/utils';

interface Args {
  locale?: string;
}

export const getNewDIInstance = ({ locale }: Args = {}) => {
  const defaultLocale = getGlobal('__LOCALE__') as Window['__LOCALE__'];
  const di = new DIFactory().make();
  di.storage.intl.setLocale(locale ?? defaultLocale);

  return di;
};

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useNewDIInstance = (args: Args = {}) => React.useMemo(() => getNewDIInstance(args), []);
