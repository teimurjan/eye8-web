import React from 'react';

import { Characteristic, CharacteristicValue, ProductTypeSortingType } from '@eye8/api';
import { CharacteristicService, CharacteristicValueService } from '@eye8/service';
import { agregateOrderedMapToArray } from '@eye8/shared/utils';

export interface ViewProps
  extends Pick<
    Props,
    'sortingType' | 'onSortingTypeChange' | 'onCharacteristicValuesChange' | 'characteristicValuesIds' | 'disabled'
  > {
  groupedCharacteristics: {
    [key: string]: { name: string; values: CharacteristicValue[] };
  };
  isLoading: boolean;
  error: string | undefined;
}

export interface Props {
  onSortingTypeChange: (sortingType: ProductTypeSortingType) => void;
  onCharacteristicValuesChange: (characteristicValueId: number[]) => void;
  View: React.ComponentType<ViewProps>;
  characteristicService: CharacteristicService;
  characteristicValueService: CharacteristicValueService;
  sortingType: ProductTypeSortingType;
  characteristicValuesIds: number[];
  disabled: boolean;
}

const ProductTypesPageFilterPresenter = ({
  onSortingTypeChange,
  onCharacteristicValuesChange,
  View,
  characteristicService,
  characteristicValueService,
  characteristicValuesIds,
  sortingType,
  disabled,
}: Props) => {
  const [characteristicsData, setCharacteristicsData] = React.useState<{
    entities: {
      [key: string]: Characteristic;
    };
    order: number[];
  }>({ entities: {}, order: [] });
  const [characteristicValuesData, setCharacteristicValuesData] = React.useState<{
    entities: {
      [key: string]: CharacteristicValue;
    };
    order: number[];
  }>({ entities: {}, order: [] });
  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<undefined | string>(undefined);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [characteristics, characteristicValues] = await Promise.all([
          characteristicService.getAll(),
          characteristicValueService.getAll(),
        ]);
        setCharacteristicsData({ entities: characteristics.entities.characteristics, order: characteristics.result });
        setCharacteristicValuesData({
          entities: characteristicValues.entities.characteristicValues,
          order: characteristicValues.result,
        });
      } catch (e) {
        setError('common.error');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groupedCharacteristics = agregateOrderedMapToArray(
    characteristicsData.entities,
    characteristicsData.order,
  ).reduce((acc, characteristic) => {
    return {
      ...acc,
      [characteristic.id]: {
        name: characteristic.name,
        values: [
          ...agregateOrderedMapToArray(characteristicValuesData.entities, characteristicValuesData.order).filter(
            (characteristicValue) => characteristicValue.characteristic.id === characteristic.id,
          ),
        ],
      },
    };
  }, {} as ViewProps['groupedCharacteristics']);

  return (
    <View
      disabled={disabled}
      characteristicValuesIds={characteristicValuesIds}
      groupedCharacteristics={groupedCharacteristics}
      sortingType={sortingType}
      onSortingTypeChange={onSortingTypeChange}
      onCharacteristicValuesChange={onCharacteristicValuesChange}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default ProductTypesPageFilterPresenter;
