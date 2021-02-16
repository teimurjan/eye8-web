import React from 'react';

import { Banner } from '@eye8/api';
import { makeEntityState, EntityContextValue } from '@eye8/shared/utils';

export type ContextValue = EntityContextValue<Banner<true>>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminBannersStateProvider = makeEntityState(
  Context,
  (d) => d.di.service.banner.getAllRawIntl(),
  'banners',
);

export const useAdminBannersState = () => React.useContext(Context) as ContextValue;
