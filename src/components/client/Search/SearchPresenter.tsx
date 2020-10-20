import * as React from 'react';

import { IProductTypeListResponseItem } from 'src/api/ProductTypeAPI';
import { useBoolean } from 'src/hooks/useBoolean';
import { useMousetrap } from 'src/hooks/useMousetrap';
import { IProductTypeService } from 'src/services/ProductTypeService';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IProps {
  View: React.ComponentType<IViewProps>;
  service: IProductTypeService;
}

export interface IViewProps {
  productTypes: IProductTypeListResponseItem[];
  error: string | undefined;
  isLoading: boolean;
  onSearchValueChange: (value: string) => Promise<void>;
  isOpen: boolean;
  close: () => void;
  open: () => void;
}

export const SearchPresenter = ({ service, View }: IProps) => {
  const { value: isOpen, setPositive: open, setNegative: close } = useBoolean();
  const [data, setData] = React.useState<{
    entities: { [id: string]: IProductTypeListResponseItem };
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
