import React from 'react';
import { useLocation } from 'react-router';

import { extractFromSearchString } from '@eye8/shared/utils';

const useSearchParams = <T>(params: T) => {
  const location = useLocation();

  return React.useMemo(() => extractFromSearchString<T>(location.search, params), [location.search, params]);
};

export default useSearchParams;
