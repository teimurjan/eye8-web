import React from 'react';

import { ContextValue as AdminBannersStateContextValue } from '@eye8/admin/state/banners';

export interface IProps {
  View: React.ComponentType<IViewProps>;
  adminBannersState: AdminBannersStateContextValue['state'];
}

export interface IViewProps {
  banners: AdminBannersStateContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

export const AdminBannersListPresenter = ({
  View,
  adminBannersState: { isListLoading, entities: banners, get: getBanners, hasListLoaded },
}: IProps) => {
  React.useEffect(() => {
    getBanners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} banners={banners} />;
};
