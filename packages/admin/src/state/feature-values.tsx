import React from 'react';

import { FeatureValueListRawIntlResponseItem } from '@eye8/api/feature-value';
import { makeEntityState, EntityContextValue } from '@eye8/shared/utils';

export type ContextValue = EntityContextValue<FeatureValueListRawIntlResponseItem, FeatureValueListRawIntlResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminFeatureValuesStateProvider = makeEntityState(
  Context,
  (d) => d.di.service.featureValue.getAllRawIntl(),
  'featureValues',
);

export const useAdminFeatureValuesState = () => React.useContext(Context) as ContextValue;
