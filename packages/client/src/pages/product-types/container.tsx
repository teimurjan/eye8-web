import { useRouter } from 'next/router';
import React from 'react';

import { useDI } from '@eye8/di';

import { ProductTypeList } from '../../components';

import ProductTypesPagePresenter, { Props as PresenterProps } from './presenter';

interface Props {
  initialProps: PresenterProps['initialProps'];
}

const ProductTypesPageContainer = ({ initialProps }: Props) => {
  const { di } = useDI();
  const router = useRouter();

  return (
    <ProductTypesPagePresenter
      router={router}
      productTypeService={di.service.productType}
      ListView={ProductTypeList}
      initialProps={initialProps}
    />
  );
};

export default ProductTypesPageContainer;
