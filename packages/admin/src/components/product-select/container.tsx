import React from 'react';

import { ProductSelectPresenter, Props as PresenterProps } from '@eye8/admin/components/product-select/presenter';
import { ProductSelectView } from '@eye8/admin/components/product-select/view';
import { useDI } from '@eye8/di';

interface Props {
  onChange: PresenterProps['onChange'];
  placeholder?: string;
  className?: string;
}

export const ProductSelectContainer = ({ onChange, placeholder, className }: Props) => {
  const { di } = useDI();

  return (
    <ProductSelectPresenter
      className={className}
      onChange={onChange}
      View={ProductSelectView}
      productTypeService={di.service.productType}
      placeholder={placeholder}
    />
  );
};
