import React from 'react';
import { useLocation } from 'react-router';

import { extractFromSearchString } from '@eye8/shared/utils';

export const useSearchParams = <T>(params: T) => {
  const location = useLocation();

  return React.useMemo(() => extractFromSearchString<T>(location.search, params), [location.search, params]);
};
