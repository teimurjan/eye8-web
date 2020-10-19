import * as React from 'react';

import { SearchPresenter } from 'src/components/client/Search/SearchPresenter';
import { SearchView } from 'src/components/client/Search/SearchView';
import { useDependencies } from 'src/DI/DI';

export const SearchContainer = () => {
  const { dependencies } = useDependencies();

  return <SearchPresenter View={SearchView} service={dependencies.services.search} />;
};
