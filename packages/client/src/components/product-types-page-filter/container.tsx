import React from 'react';

import {
  ProductTypesPageFilterPresenter,
  IProps as IPresenterProps,
} from '@eye8/client/components/product-types-page-filter/presenter';
import { ProductTypesPageFilterView } from '@eye8/client/components/product-types-page-filter/view';
import { useDependencies } from '@eye8/di';

export const ProductTypesPageFilterContainer = ({
  onSortingTypeChange,
  onCharacteristicValuesChange,
  sortingType,
  characteristicValuesIds,
  disabled,
}: Pick<
  IPresenterProps,
  'sortingType' | 'onSortingTypeChange' | 'onCharacteristicValuesChange' | 'characteristicValuesIds' | 'disabled'
>) => {
  const {
    dependencies: {
      services: { characteristic: characteristicService, characteristicValue: characteristicValueService },
    },
  } = useDependencies();

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
