import * as React from 'react';

import { useDebounce } from 'src/hooks/useDebounce';
import { ContextValue as AdminFeatureValuesStateContextValue } from 'src/state/AdminFeatureValuesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminFeatureValuesState: AdminFeatureValuesStateContextValue['state'];
}

export interface IViewProps {
  featureValues: AdminFeatureValuesStateContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
  locales: string[];
}

export const AdminFeatureValuesListPresenter = ({
  View,
  adminFeatureValuesState: { isListLoading, entities: featureValues, get: getFeatureValues, hasListLoaded },
  intlState: { availableLocales },
}: IProps & IntlStateContextValue) => {
  const isLoadingDebounced = useDebounce(isListLoading, 1000);

  React.useEffect(() => {
    getFeatureValues();
  }, [getFeatureValues]);

  return (
    <View
      isDataLoaded={hasListLoaded}
      isLoading={isLoadingDebounced}
      locales={availableLocales.map(({ name }) => name)}
      featureValues={featureValues}
    />
  );
};
