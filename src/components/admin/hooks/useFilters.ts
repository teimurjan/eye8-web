import React from 'react';
import { useHistory } from 'react-router';

import { useSearchParams } from 'src/components/admin/hooks/useSearchParams';
import { buildSearchString } from 'src/utils/searchString';

interface IArgs<I extends object> {
  initialFilters: I;
  relyOn: 'location' | 'state';
  initialFrom?: 'location' | 'state';
}

export const useFilters = <I extends object>({ initialFilters, relyOn, initialFrom = relyOn }: IArgs<I>) => {
  const history = useHistory();
  const filtersFromSearch = useSearchParams(Object.keys(initialFilters)) as {
    [key in keyof typeof initialFilters]: typeof initialFilters[key];
  };
  const [filters, setFilters] = React.useState(initialFrom === 'location' ? filtersFromSearch : initialFilters);

  const sync = React.useCallback(() => {
    if (relyOn === 'location') {
      setFilters(filtersFromSearch);
    } else {
      history.push(`${history.location.pathname}${buildSearchString(filters)}`);
    }
  }, [filtersFromSearch, history, filters, relyOn]);

  React.useEffect(() => {
    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersFromSearch, filters]);

  return { filters, setFilters };
};
