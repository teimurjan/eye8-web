import * as React from 'react';

import { ICategoryListResponseItem } from 'src/api/CategoryAPI';
import { IProductTypeListResponseItem } from 'src/api/ProductTypeAPI';
import { useBoolean } from 'src/hooks/useBoolean';
import { useMousetrap } from 'src/hooks/useMousetrap';
import { ISearchService } from 'src/services/SearchService';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: ISearchService;
}

export interface IViewProps {
  categories: ICategoryListResponseItem[];
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
    categories: { [id: string]: ICategoryListResponseItem };
    productTypes: { [id: string]: IProductTypeListResponseItem };
  }>({ categories: {}, productTypes: {} });
  const [order, setOrder] = React.useState<{ categories: number[]; productTypes: number[] }>({
    categories: [],
    productTypes: [],
  });
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
          setData({ categories: {}, productTypes: {} });
          setOrder({ categories: [], productTypes: [] });
        } else {
          const { entities, result } = await service.search(value);
          setData(entities);
          setOrder(result);
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
      categories={agregateOrderedMapToArray(data.categories, order.categories)}
      productTypes={agregateOrderedMapToArray(data.productTypes, order.productTypes)}
      onSearchValueChange={onSearchValueChange}
      error={error}
    />
  );
};
