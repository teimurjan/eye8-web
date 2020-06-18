import { useRouter } from 'next/router';
import * as React from 'react';

import { ProductTypesListView } from 'src/components/Client/ProductType/ProductTypesList/ProductTypesListView';
import {
  ProductTypesPagePresenter,
  IProps as IPresenterProps,
} from 'src/components/Client/ProducTypesPage/ProductTypesPagePresenter';
import { useDependencies } from 'src/DI/DI';
import { paramToIDOrSlug } from 'src/utils/params';

interface IProps {
  initialProps?: IPresenterProps['initialProps'];
}

export const ProductTypesPageContainer = ({ initialProps }: IProps) => {
  const { dependencies } = useDependencies();
  const router = useRouter();

  return (
    <ProductTypesPagePresenter
      router={router}
      categoryIdOrSlug={paramToIDOrSlug(router.query.id as string)}
      productTypeService={dependencies.services.productType}
      ListView={ProductTypesListView}
      initialProps={initialProps}
    />
  );
};
