import React from 'react';

import { AdminFeatureValuesState } from '../../../state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  adminFeatureValuesState: AdminFeatureValuesState;
}

export interface ViewProps {
  featureValues: AdminFeatureValuesState['entities'];
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
