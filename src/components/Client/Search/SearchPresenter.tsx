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
    categories: { entities: { [id: string]: ICategoryListResponseItem }; order: number[] };
    productTypes: { entities: { [id: string]: IProductTypeListResponseItem }; order: number[] };
  }>({ categories: { entities: {}, order: [] }, productTypes: { entities: {}, order: [] } });
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
          setData({ categories: { entities: {}, order: [] }, productTypes: { entities: {}, order: [] } });
        } else {
          const { entities, result } = await service.search(value);
          setData({
            categories: { entities: entities.categories, order: result.categories },
            productTypes: { entities: entities.productTypes, order: result.productTypes },
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
      categories={agregateOrderedMapToArray(data.categories.entities, data.categories.order)}
      productTypes={agregateOrderedMapToArray(data.productTypes.entities, data.productTypes.order)}
      onSearchValueChange={onSearchValueChange}
      error={error}
    />
  );
};
