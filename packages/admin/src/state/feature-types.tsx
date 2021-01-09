import React from 'react';

import { FeatureTypeListRawIntlResponseItem } from '@eye8/api/feature-type';
import { makeEntityState, EntityContextValue } from '@eye8/shared/utils';

export type ContextValue = EntityContextValue<FeatureTypeListRawIntlResponseItem, FeatureTypeListRawIntlResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminFeatureTypesStateProvider = makeEntityState(
  Context,
  (d) => d.dependencies.services.featureType.getAllRawIntl(),
  'featureTypes',
);

export const useAdminFeatureTypesState = () => React.useContext(Context) as ContextValue;
