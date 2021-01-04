import React from 'react';

import { IFeatureValueListRawIntlResponseItem } from '@eye8/api/feature-value';
import { makeEntityState, IContextValue } from '@eye8/shared/utils';

export type ContextValue = IContextValue<IFeatureValueListRawIntlResponseItem, IFeatureValueListRawIntlResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminFeatureValuesStateProvider = makeEntityState(
  Context,
  (d) => d.dependencies.services.featureValue.getAllRawIntl(),
  'featureValues',
);

export const useAdminFeatureValuesState = () => React.useContext(Context) as ContextValue;
