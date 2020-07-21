import * as React from 'react';

import { IFeatureValueListRawIntlResponseItem } from 'src/api/FeatureValueAPI';
import { extendIntlTextWithLocaleNames } from 'src/helpers/intl';
import { makeEntityState, IContextValue } from 'src/state/makeEntityState';

export type ContextValue = IContextValue<IFeatureValueListRawIntlResponseItem, IFeatureValueListRawIntlResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminFeatureValuesStateProvider = makeEntityState(
  Context,
  d => d.dependencies.services.featureValue.getAllRawIntl(),
  'featureValues',
  (featureValue, { availableLocales }) => ({
    ...featureValue,
    name: extendIntlTextWithLocaleNames(featureValue.name, availableLocales),
    feature_type: {
      ...featureValue.feature_type,
      name: extendIntlTextWithLocaleNames(featureValue.feature_type.name, availableLocales),
    },
  }),
);

export const useAdminFeatureValuesState = () => React.useContext(Context) as ContextValue;
