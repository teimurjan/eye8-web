import React from 'react';

import { useDI } from '@eye8/di';

import ProductSelectPresenter, { Props as PresenterProps } from './presenter';
import ProductSelectView from './view';

interface Props {
  onChange: PresenterProps['onChange'];
  placeholder?: string;
  className?: string;
}

const ProductSelectContainer = ({ onChange, placeholder, className }: Props) => {
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

export default ProductSelectContainer;
