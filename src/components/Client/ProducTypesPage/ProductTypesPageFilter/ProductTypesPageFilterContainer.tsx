import React from 'react';

import { ProductTypesPageFilterView } from 'src/components/Client/ProducTypesPage/ProductTypesPageFilter/ProductTypesPageFilterView';
import { useDependencies } from 'src/DI/DI';

import { ProductTypesPageFilterPresenter, IProps as IPresenterProps } from './ProductTypesPageFilterPresenter';

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
