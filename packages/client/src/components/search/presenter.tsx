import React from 'react';

import { ProductTypeListResponseItem } from '@eye8/api/product-type';
import { ProductTypeService } from '@eye8/service/product-type';
import { useBoolean, useMousetrap } from '@eye8/shared/hooks';
import { agregateOrderedMapToArray } from '@eye8/shared/utils';

export interface Props {
  View: React.ComponentType<ViewProps>;
  service: ProductTypeService;
}

export interface ViewProps {
  productTypes: ProductTypeListResponseItem[];
  error: string | undefined;
  isLoading: boolean;
  onSearchValueChange: (value: string) => Promise<void>;
  isOpen: boolean;
  close: () => void;
  open: () => void;
}

const SearchPresenter = ({ service, View }: Props) => {
  const { value: isOpen, setPositive: open, setNegative: close } = useBoolean();
  const [data, setData] = React.useState<{
    entities: { [id: string]: ProductTypeListResponseItem };
    order: number[];
  }>({ entities: {}, order: [] });
  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const openOnKeyDown = React.useCallback(
    (e: Event) => {
      e.preventDefault && e.preventDefault();
      open();
    },
    [open],
  );

  useMousetrap('shift+f', openOnKeyDown);

  const onSearchValueChange = React.useCallback(
    async (value: string) => {
      setError(undefined);
      setLoading(true);
      try {
        if (value.length === 0) {
          setData({ entities: {}, order: [] });
        } else {
          const { entities, result } = await service.search(value);
          setData({
            entities: entities.productTypes,
            order: result,
          });
        }
      } catch (e) {
        setError('errors.common');
      } finally {
        setLoading(false);
      }
    },
    [service],
  );

  return (
    <View
      isOpen={isOpen}
      open={open}
      close={close}
      isLoading={isLoading}
      productTypes={agregateOrderedMapToArray(data.entities, data.order)}
      onSearchValueChange={onSearchValueChange}
      error={error}
    />
  );
};

export default SearchPresenter;
