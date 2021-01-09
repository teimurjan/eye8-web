import React from 'react';

import { ProductListResponseItem } from '@eye8/api/product';
import { ProductTypeListResponseItem } from '@eye8/api/product-type';
import { ProductTypeService } from '@eye8/service/product-type';
import { agregateOrderedMapToArray } from '@eye8/shared/utils';

export interface Props {
  View: React.ComponentType<ViewProps>;
  productTypeService: ProductTypeService;
  onChange: (product: ProductListResponseItem) => void;
  placeholder?: string;
  className?: string;
}

export interface ViewProps {
  productTypes: ProductTypeListResponseItem[];
  error: string | undefined;
  isLoading: boolean;
  onSearchValueChange: (value: string) => Promise<void>;
  selectProductType: (productType?: ProductTypeListResponseItem) => void;
  selectedProductType?: ProductTypeListResponseItem;
  onChange: Props['onChange'];
  placeholder?: string;
  className?: string;
}

export const ProductSelectPresenter = ({ productTypeService, onChange, View, placeholder, className }: Props) => {
  const [selectedProductType, setSelectedProductType] = React.useState<ProductTypeListResponseItem | undefined>(
    undefined,
  );
  const [data, setData] = React.useState<{
    entities: { [key: number]: ProductTypeListResponseItem };
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
          const { entities, result } = await productTypeService.search(value);
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
    [productTypeService],
  );

  const selectProductType: ViewProps['selectProductType'] = React.useCallback(async (productType) => {
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
