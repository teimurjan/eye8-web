import { useRouter } from 'next/router';
import * as React from 'react';

import { ProductTypesListView } from 'src/components/client/ProductType/ProductTypesList/ProductTypesListView';
import {
  ProductTypesPagePresenter,
  IProps as IPresenterProps,
} from 'src/components/client/ProducTypesPage/ProductTypesPagePresenter';
import { useDependencies } from 'src/DI/DI';

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
