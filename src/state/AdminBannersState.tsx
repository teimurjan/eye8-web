import * as React from 'react';

import { IBannerListRawIntlResponseItem } from 'src/api/BannerAPI';
import { extendIntlTextWithLocaleNames } from 'src/helpers/intl';
import { makeEntityState, IContextValue } from 'src/state/AdminEntityState';

export type ContextValue = IContextValue<IBannerListRawIntlResponseItem, undefined, IBannerListRawIntlResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminBannersStateProvider = makeEntityState(
  Context,
  d => d.dependencies.services.banner.getAllRawIntl(),
  'banners',
  (banner, { availableLocales }) => ({
    ...banner,
    text: extendIntlTextWithLocaleNames(banner.text, availableLocales),
  }),
);

export const useAdminBannersState = () => React.useContext(Context) as ContextValue;
