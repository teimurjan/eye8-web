import React from 'react';

import { ContextValue as AdminFeatureValuesStateContextValue } from '@eye8/admin/state/feature-values';

export interface Props {
  View: React.ComponentType<ViewProps>;
  adminFeatureValuesState: AdminFeatureValuesStateContextValue['state'];
}

export interface ViewProps {
  featureValues: AdminFeatureValuesStateContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

export const AdminFeatureValuesListPresenter = ({
  View,
  adminFeatureValuesState: { isListLoading, entities: featureValues, get: getFeatureValues, hasListLoaded },
}: Props) => {
  React.useEffect(() => {
    getFeatureValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} featureValues={featureValues} />;
};
