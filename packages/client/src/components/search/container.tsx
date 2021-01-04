import React from 'react';

import { SearchPresenter } from '@eye8/client/components/search/presenter';
import { SearchView } from '@eye8/client/components/search/view';
import { useDependencies } from '@eye8/di';

export const SearchContainer = () => {
  const { dependencies } = useDependencies();

  return <SearchPresenter View={SearchView} service={dependencies.services.productType} />;
};
