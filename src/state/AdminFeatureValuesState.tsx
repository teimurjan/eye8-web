import * as React from 'react';

import { IFeatureValueListRawIntlResponseItem } from 'src/api/FeatureValueAPI';
import { makeEntityState, IContextValue } from 'src/state/makeEntityState';

export type ContextValue = IContextValue<IFeatureValueListRawIntlResponseItem, IFeatureValueListRawIntlResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminFeatureValuesStateProvider = makeEntityState(
  Context,
  (d) => d.dependencies.services.featureValue.getAllRawIntl(),
  'featureValues',
);

export const useAdminFeatureValuesState = () => React.useContext(Context) as ContextValue;
