import React from 'react';
import { useLocation } from 'react-router';

import { arrayAsDep } from 'src/utils/hooks';
import { ISearchParams } from 'src/utils/queryString';

const deserialize = (value: string | null) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value?.match(/^\d+$/)) return parseInt(value, 10);
  return value;
};

export const useSearchParams = <T extends string>(...params: T[]) => {
  const location = useLocation();
  const searchParams = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
  const paramsDep = arrayAsDep(params);
  return React.useMemo(
    () =>
      params.reduce(
        (acc, param) => ({ ...acc, [param]: deserialize(searchParams.get(param)) }),
        {} as ISearchParams<T>,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, paramsDep],
  );
};
