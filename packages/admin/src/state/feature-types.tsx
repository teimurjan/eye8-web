import React from 'react';

import { IFeatureTypeListRawIntlResponseItem } from '@eye8/api/feature-type';
import { makeEntityState, IContextValue } from '@eye8/shared/utils';

export type ContextValue = IContextValue<IFeatureTypeListRawIntlResponseItem, IFeatureTypeListRawIntlResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminFeatureTypesStateProvider = makeEntityState(
  Context,
  (d) => d.dependencies.services.featureType.getAllRawIntl(),
  'featureTypes',
);

export const useAdminFeatureTypesState = () => React.useContext(Context) as ContextValue;
