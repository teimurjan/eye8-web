import { Select } from 'antd';
import React, { useCallback, UIEventHandler } from 'react';

import { Product } from '@eye8/api';

import { useSelectProducts } from '../../hooks';

interface Props {
  onChange: (products: Product) => void;
  value?: number;
  placeholder?: string;
}

const ProductSelect = ({ placeholder, value, onChange }: Props) => {
  const {
    products,
    isLoading: productsLoading,
    loadMore: LoadMoreProducts,
  } = useSelectProducts({
    mandatoryProductId: value,
  });

  const onProductChange = (id: number) => {
    const product_ = products.find((product) => product.id === id);
    if (product_) {
      onChange(product_);
    }
  };

  const options = products.map((product) => ({
    value: product.id,
    label: `${product.product_type.name} (${product.feature_values.map(({ name }) => name).join(', ')})`,
  }));

  const onScroll: UIEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      const target = event.target as HTMLDivElement;
      if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
        LoadMoreProducts();
      }
    },
    [LoadMoreProducts],
  );

  return (
    <Select
      placeholder={placeholder}
      value={value}
      options={options}
      onChange={onProductChange}
      loading={productsLoading}
      onPopupScroll={onScroll}
      optionFilterProp="label"
      showSearch
    />
  );
};

export default ProductSelect;
