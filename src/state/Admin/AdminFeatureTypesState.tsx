import * as React from 'react';

import { IFeatureTypeListRawIntlResponseItem } from 'src/api/FeatureTypeAPI';
import { makeEntityState, IContextValue } from 'src/state/makeEntityState';

export type ContextValue = IContextValue<IFeatureTypeListRawIntlResponseItem, IFeatureTypeListRawIntlResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminFeatureTypesStateProvider = makeEntityState(
  Context,
  (d) => d.dependencies.services.featureType.getAllRawIntl(),
  'featureTypes',
);

export const useAdminFeatureTypesState = () => React.useContext(Context) as ContextValue;
