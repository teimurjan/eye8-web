import { useRouter } from 'next/router';
import React from 'react';

import { ProductTypesListView } from '@eye8/client/components/product-type-list';
import { ProductTypesPagePresenter, Props as PresenterProps } from '@eye8/client/pages/product-types/presenter';
import { useDI } from '@eye8/di';

interface Props {
  initialProps: PresenterProps['initialProps'];
}

export const ProductTypesPageContainer = ({ initialProps }: Props) => {
  const { di } = useDI();
  const router = useRouter();

  return (
    <ProductTypesPagePresenter
      router={router}
      productTypeService={di.service.productType}
      ListView={ProductTypesListView}
      initialProps={initialProps}
    />
  );
};
