import * as React from 'react';

import { HomePresenter, IProps as IPresenterProps } from 'src/components/client/Home/HomePresenter';
import { HomeView } from 'src/components/client/Home/HomeView';
import { useDependencies } from 'src/DI/DI';
import { useAppState } from 'src/state/AppState';

export const HomeContainer = ({ initialProps }: { initialProps?: IPresenterProps['initialProps'] }) => {
  const { appState } = useAppState();
  const {
    dependencies: {
      services: { banner: bannerService, productType: productTypeService },
    },
  } = useDependencies();

  return (
    <HomePresenter
      initialProps={initialProps}
      appState={appState}
      bannerService={bannerService}
      productTypeService={productTypeService}
      View={HomeView}
    />
  );
};
