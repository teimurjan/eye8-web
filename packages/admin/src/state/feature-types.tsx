import React from 'react';

import { FeatureType } from '@eye8/api';
import { makeEntityState, EntityContextValue } from '@eye8/shared/utils';

export type ContextValue = EntityContextValue<FeatureType<true>>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminFeatureTypesStateProvider = makeEntityState(
  Context,
  (d) => d.di.service.featureType.getAllRawIntl(),
  'featureTypes',
);

export const useAdminFeatureTypesState = () => React.useContext(Context) as ContextValue;
