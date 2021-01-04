import React from 'react';

import { HomePresenter, IProps as IPresenterProps } from '@eye8/client/pages/home/presenter';
import { HomeView } from '@eye8/client/pages/home/view';
import { useDependencies } from '@eye8/di';

export const HomeContainer = ({ initialProps }: { initialProps?: IPresenterProps['initialProps'] }) => {
  const {
    dependencies: {
      services: { banner: bannerService, productType: productTypeService },
    },
  } = useDependencies();

  return (
    <HomePresenter
      initialProps={initialProps}
      bannerService={bannerService}
      productTypeService={productTypeService}
      View={HomeView}
    />
  );
};