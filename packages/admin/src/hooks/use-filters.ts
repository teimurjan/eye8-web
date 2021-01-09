import React from 'react';
import { useHistory } from 'react-router';

import { useSearchParams } from '@eye8/admin/hooks/use-search-params';
import { buildSearchString } from '@eye8/shared/utils';

interface Args<T> {
  initialFilters: T;
  relyOn: 'location' | 'state';
  initialFrom?: 'location' | 'state';
}

export const useFilters = <T>({ initialFilters, relyOn, initialFrom = relyOn }: Args<T>) => {
  const history = useHistory();
  const filtersFromSearch = useSearchParams(initialFilters);
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
