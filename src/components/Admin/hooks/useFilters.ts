import React from 'react';
import { useHistory } from 'react-router';

import { useSearchParams } from 'src/components/Admin/hooks/useSearchParams';
import { buildSearchString, ISearchParams } from 'src/utils/queryString';

interface IArgs<T extends string> {
  initialFilters: ISearchParams<T>;
  relyOn: 'location' | 'state';
  initialFrom?: 'location' | 'state';
}

export const useFilters = <T extends string>({ initialFilters, relyOn, initialFrom = relyOn }: IArgs<T>) => {
  const history = useHistory();
  const filtersFromURL = useSearchParams(...Object.keys(initialFilters));
  const [filters, setFilters] = React.useState(initialFrom === 'location' ? filtersFromURL : initialFilters);

  const sync = React.useCallback(() => {
    if (relyOn === 'location') {
      setFilters(filtersFromURL);
    } else {
      history.push(`${history.location.pathname}${buildSearchString(filters)}`);
    }
  }, [filtersFromURL, history, filters, relyOn]);

  React.useEffect(() => {
    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersFromURL, filters]);

  return { filters, setFilters };
};
