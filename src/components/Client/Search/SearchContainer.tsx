import * as React from 'react';

import { SearchPresenter } from 'src/components/Client/Search/SearchPresenter';
import { SearchView } from 'src/components/Client/Search/SearchView';
import { useDependencies } from 'src/DI/DI';

export const SearchContainer = () => {
  const { dependencies } = useDependencies();

  return <SearchPresenter View={SearchView} service={dependencies.services.search} />;
};
