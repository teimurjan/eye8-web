import * as React from 'react';

import { IProductListResponseItem } from 'src/api/ProductAPI';
import { IProductTypeListResponseItem } from 'src/api/ProductTypeAPI';
import { ISearchService } from 'src/services/SearchService';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  searchService: ISearchService;
  onChange: (product: IProductListResponseItem) => void;
  placeholder?: string;
  className?: string;
}

export interface IViewProps {
  productTypes: IProductTypeListResponseItem[];
  error: string | undefined;
  isLoading: boolean;
  onSearchValueChange: (value: string) => Promise<void>;
  selectProductType: (productType?: IProductTypeListResponseItem) => void;
  selectedProductType?: IProductTypeListResponseItem;
  onChange: IProps['onChange'];
  placeholder?: string;
  className?: string;
}

export const ProductSelectPresenter = ({ searchService, onChange, View, placeholder, className }: IProps) => {
  const [selectedProductType, setSelectedProductType] = React.useState<IProductTypeListResponseItem | undefined>(
    undefined,
  );
  const [data, setData] = React.useState<{
    entities: { [key: number]: IProductTypeListResponseItem };
    order: number[];
  }>({
    entities: {},
    order: [],
  });
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const onSearchValueChange = React.useCallback(
    async (value: string) => {
      try {
        setError(undefined);
        if (value.length === 0) {
          setData({ entities: {}, order: [] });
        } else {
          const { entities, result } = await searchService.search(value);
          setData({ entities: entities.productTypes, order: result.productTypes });
        }
      } catch (e) {
        setError('errors.common');
      } finally {
        setLoading(false);
      }
    },
    [searchService],
  );

  const selectProductType: IViewProps['selectProductType'] = React.useCallback(async (productType) => {
    setSelectedProductType(productType);
  }, []);

  return (
    <View
      className={className}
      isLoading={isLoading}
      productTypes={agregateOrderedMapToArray(data.entities, data.order)}
      onSearchValueChange={onSearchValueChange}
      error={error}
      selectProductType={selectProductType}
      selectedProductType={selectedProductType}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};
