import React from 'react';

import { ContextValue as AdminBannersStateContextValue } from '@eye8/admin/state/banners';

export interface Props {
  View: React.ComponentType<ViewProps>;
  adminBannersState: AdminBannersStateContextValue['state'];
}

export interface ViewProps {
  banners: AdminBannersStateContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

export const AdminBannersListPresenter = ({
  View,
  adminBannersState: { isListLoading, entities: banners, get: getBanners, hasListLoaded },
}: Props) => {
  React.useEffect(() => {
    getBanners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} banners={banners} />;
};
