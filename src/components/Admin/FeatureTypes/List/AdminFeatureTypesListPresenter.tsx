import * as React from 'react';

import { useDebounce } from 'src/hooks/useDebounce';
import { ContextValue as AdminFeatureTypesContextValue } from 'src/state/AdminFeatureTypesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps extends IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminFeatureTypesState: AdminFeatureTypesContextValue['state'];
}

export interface IViewProps {
  featureTypes: AdminFeatureTypesContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
  locales: string[];
}

export const AdminFeatureTypesListPresenter = ({
  View,
  adminFeatureTypesState: { isListLoading, entities: featureTypes, get: getFeatureTypes, hasListLoaded },
  intlState: { availableLocales },
}: IProps) => {
  const isLoadingDebounced = useDebounce(isListLoading, 1000);

  React.useEffect(() => {
    getFeatureTypes();
  }, [getFeatureTypes]);

  return (
    <View
      isDataLoaded={hasListLoaded}
      isLoading={isLoadingDebounced}
      locales={availableLocales.map(({ name }) => name)}
      featureTypes={featureTypes}
    />
  );
};
