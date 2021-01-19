import React from 'react';

import { SearchPresenter } from '@eye8/client/components/search/presenter';
import { SearchView } from '@eye8/client/components/search/view';
import { useDI } from '@eye8/di';

export const SearchContainer = () => {
  const { di } = useDI();

  return <SearchPresenter View={SearchView} service={di.service.productType} />;
};
