import React from 'react';

import { Product, ProductType } from '@eye8/api';
import { ProductTypeService } from '@eye8/service';
import { agregateOrderedMapToArray } from '@eye8/shared/utils';

export interface Props {
  View: React.ComponentType<ViewProps>;
  productTypeService: ProductTypeService;
  onChange: (product: Product) => void;
  placeholder?: string;
  className?: string;
}

export interface ViewProps {
  productTypes: ProductType[];
  error: string | undefined;
  isLoading: boolean;
  onSearchValueChange: (value: string) => Promise<void>;
  selectProductType: (productType?: ProductType) => void;
  selectedProductType?: ProductType;
  onChange: Props['onChange'];
  placeholder?: string;
  className?: string;
}

const ProductSelectPresenter = ({ productTypeService, onChange, View, placeholder, className }: Props) => {
  const [selectedProductType, setSelectedProductType] = React.useState<ProductType | undefined>(undefined);
  const [data, setData] = React.useState<{
    entities: { [key: number]: ProductType };
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

export default ProductSelectPresenter;
