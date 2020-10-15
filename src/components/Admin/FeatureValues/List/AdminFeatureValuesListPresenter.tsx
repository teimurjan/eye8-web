import * as React from 'react';

import { ContextValue as AdminFeatureValuesStateContextValue } from 'src/state/Admin/AdminFeatureValuesState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminFeatureValuesState: AdminFeatureValuesStateContextValue['state'];
}

export interface IViewProps {
  featureValues: AdminFeatureValuesStateContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

export const AdminFeatureValuesListPresenter = ({
  View,
  adminFeatureValuesState: { isListLoading, entities: featureValues, get: getFeatureValues, hasListLoaded },
}: IProps) => {
  React.useEffect(() => {
    getFeatureValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} featureValues={featureValues} />;
};
