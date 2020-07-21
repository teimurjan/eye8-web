import * as React from 'react';

import { IFeatureTypeListRawIntlResponseItem } from 'src/api/FeatureTypeAPI';
import { extendIntlTextWithLocaleNames } from 'src/helpers/intl';
import { makeEntityState, IContextValue } from 'src/state/makeEntityState';

export type ContextValue = IContextValue<IFeatureTypeListRawIntlResponseItem, IFeatureTypeListRawIntlResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminFeatureTypesStateProvider = makeEntityState(
  Context,
  d => d.dependencies.services.featureType.getAllRawIntl(),
  'featureTypes',
  (featureType, { availableLocales }) => ({
    ...featureType,
    name: extendIntlTextWithLocaleNames(featureType.name, availableLocales),
  }),
);

export const useAdminFeatureTypesState = () => React.useContext(Context) as ContextValue;
