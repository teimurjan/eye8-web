import React from 'react';

import { useDI } from '@eye8/di';

import HomePresenter, { Props as PresenterProps } from './presenter';
import HomeView from './view';

const HomeContainer = ({ initialProps }: { initialProps?: PresenterProps['initialProps'] }) => {
  const {
    di: {
      service: { banner: bannerService, productType: productTypeService },
    },
  } = useDI();

  return (
    <HomePresenter
      initialProps={initialProps}
      bannerService={bannerService}
      productTypeService={productTypeService}
      View={HomeView}
    />
  );
};

export default HomeContainer;
