import React from 'react';

import { BannerListRawIntlResponseItem } from '@eye8/api/banner';
import { makeEntityState, EntityContextValue } from '@eye8/shared/utils';

export type ContextValue = EntityContextValue<BannerListRawIntlResponseItem, BannerListRawIntlResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminBannersStateProvider = makeEntityState(
  Context,
  (d) => d.dependencies.services.banner.getAllRawIntl(),
  'banners',
);

export const useAdminBannersState = () => React.useContext(Context) as ContextValue;
