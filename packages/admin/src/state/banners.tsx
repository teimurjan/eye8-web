import React from 'react';

import { IBannerListRawIntlResponseItem } from '@eye8/api/banner';
import { makeEntityState, IContextValue } from '@eye8/shared/utils';

export type ContextValue = IContextValue<IBannerListRawIntlResponseItem, IBannerListRawIntlResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminBannersStateProvider = makeEntityState(
  Context,
  (d) => d.dependencies.services.banner.getAllRawIntl(),
  'banners',
);

export const useAdminBannersState = () => React.useContext(Context) as ContextValue;
