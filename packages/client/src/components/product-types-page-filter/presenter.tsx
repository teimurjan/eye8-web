import React from 'react';

import { ICharacteristicListResponseItem } from '@eye8/api/characteristic';
import { ICharacteristicValueListResponseItem } from '@eye8/api/characteristic-value';
import { ProductTypeSortingType } from '@eye8/api/product-type';
import { ICharacteristicService } from '@eye8/service/characteristic';
import { ICharacteristicValueService } from '@eye8/service/characteristic-value';
import { agregateOrderedMapToArray } from '@eye8/shared/utils';

export interface IViewProps
  extends Pick<
    IProps,
    'sortingType' | 'onSortingTypeChange' | 'onCharacteristicValuesChange' | 'characteristicValuesIds' | 'disabled'
  > {
  groupedCharacteristics: {
    [key: string]: { name: string; values: ICharacteristicValueListResponseItem[] };
  };
  isLoading: boolean;
  error: string | undefined;
}

export interface IProps {
  onSortingTypeChange: (sortingType: ProductTypeSortingType) => void;
  onCharacteristicValuesChange: (characteristicValueId: number[]) => void;
  View: React.ComponentType<IViewProps>;
  characteristicService: ICharacteristicService;
  characteristicValueService: ICharacteristicValueService;
  sortingType: ProductTypeSortingType;
  characteristicValuesIds: number[];
  disabled: boolean;
}

export const ProductTypesPageFilterPresenter = ({
  onSortingTypeChange,
  onCharacteristicValuesChange,
  View,
  characteristicService,
  characteristicValueService,
  characteristicValuesIds,
  sortingType,
  disabled,
}: IProps) => {
  const [characteristicsData, setCharacteristicsData] = React.useState<{
    entities: {
      [key: string]: ICharacteristicListResponseItem;
    };
    order: number[];
  }>({ entities: {}, order: [] });
  const [characteristicValuesData, setCharacteristicValuesData] = React.useState<{
    entities: {
      [key: string]: ICharacteristicValueListResponseItem;
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
  }, {} as IViewProps['groupedCharacteristics']);

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
