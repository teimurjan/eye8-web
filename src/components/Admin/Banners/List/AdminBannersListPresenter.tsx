import * as React from 'react';

import { ContextValue as AdminBannersStateContextValue } from 'src/state/AdminBannersState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps extends IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminBannersState: AdminBannersStateContextValue['state'];
}

export interface IViewProps {
  banners: AdminBannersStateContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
  locales: string[];
}

export const AdminBannersListPresenter = ({
  View,
  adminBannersState: { isListLoading, entities: banners, get: getBanners, hasListLoaded },
  intlState: { availableLocales },
}: IProps) => {
  React.useEffect(() => {
    getBanners();
  }, [getBanners]);

  return (
    <View
      isDataLoaded={hasListLoaded}
      isLoading={isListLoading}
      locales={availableLocales.map(({ name }) => name)}
      banners={banners}
    />
  );
};
