import { useRouter } from 'next/router';
import React from 'react';

import { ProductTypesListView } from '@eye8/client/components/product-type-list';
import { ProductTypesPagePresenter, IProps as IPresenterProps } from '@eye8/client/pages/product-types/presenter';
import { useDependencies } from '@eye8/di';

interface IProps {
  initialProps: IPresenterProps['initialProps'];
}

export const ProductTypesPageContainer = ({ initialProps }: IProps) => {
  const { dependencies } = useDependencies();
  const router = useRouter();

  return (
    <ProductTypesPagePresenter
      router={router}
      productTypeService={dependencies.services.productType}
      ListView={ProductTypesListView}
      initialProps={initialProps}
    />
  );
};
