import * as React from 'react';

import { IBannerListRawIntlResponseItem } from 'src/api/BannerAPI';
import { makeEntityState, IContextValue } from 'src/state/makeEntityState';

export type ContextValue = IContextValue<IBannerListRawIntlResponseItem, IBannerListRawIntlResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminBannersStateProvider = makeEntityState(
  Context,
  (d) => d.dependencies.services.banner.getAllRawIntl(),
  'banners',
);

export const useAdminBannersState = () => React.useContext(Context) as ContextValue;