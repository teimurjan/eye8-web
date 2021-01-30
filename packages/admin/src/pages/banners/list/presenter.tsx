import React from 'react';

import { AdminBannersState } from '@eye8/admin/state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  adminBannersState: AdminBannersState;
}

export interface ViewProps {
  banners: AdminBannersState['entities'];
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
