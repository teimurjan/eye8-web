import React from 'react';

import { useDI } from '@eye8/di';

import SearchPresenter from './presenter';
import SearchView from './view';

const SearchContainer = () => {
  const { di } = useDI();

  return <SearchPresenter View={SearchView} service={di.service.productType} />;
};

export default SearchContainer;
