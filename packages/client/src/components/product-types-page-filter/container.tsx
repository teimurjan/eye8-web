import React from 'react';

import { useDI } from '@eye8/di';

import ProductTypesPageFilterPresenter, { Props as PresenterProps } from './presenter';
import ProductTypesPageFilterView from './view';

const ProductTypesPageFilterContainer = ({
  onSortingTypeChange,
  onCharacteristicValuesChange,
  sortingType,
  characteristicValuesIds,
  disabled,
}: Pick<
  PresenterProps,
  'sortingType' | 'onSortingTypeChange' | 'onCharacteristicValuesChange' | 'characteristicValuesIds' | 'disabled'
>) => {
  const {
    di: {
      service: { characteristic: characteristicService, characteristicValue: characteristicValueService },
    },
  } = useDI();

  return (
    <ProductTypesPageFilterPresenter
      disabled={disabled}
      characteristicValuesIds={characteristicValuesIds}
      sortingType={sortingType}
      View={ProductTypesPageFilterView}
      onSortingTypeChange={onSortingTypeChange}
      onCharacteristicValuesChange={onCharacteristicValuesChange}
      characteristicService={characteristicService}
      characteristicValueService={characteristicValueService}
    />
  );
};

export default ProductTypesPageFilterContainer;
