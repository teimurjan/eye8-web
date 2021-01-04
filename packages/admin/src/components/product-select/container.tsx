import React from 'react';

import { ProductSelectPresenter, IProps as IPresenterProps } from '@eye8/admin/components/product-select/presenter';
import { ProductSelectView } from '@eye8/admin/components/product-select/view';
import { useDependencies } from '@eye8/di';

interface IProps {
  onChange: IPresenterProps['onChange'];
  placeholder?: string;
  className?: string;
}

export const ProductSelectContainer = ({ onChange, placeholder, className }: IProps) => {
  const { dependencies } = useDependencies();

  return (
    <ProductSelectPresenter
      className={className}
      onChange={onChange}
      View={ProductSelectView}
      productTypeService={dependencies.services.productType}
      placeholder={placeholder}
    />
  );
};
