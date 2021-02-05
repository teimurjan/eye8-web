import React from 'react';

import { AdminFeatureTypesState } from '../../../state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  adminFeatureTypesState: AdminFeatureTypesState;
}

export interface ViewProps {
  featureTypes: AdminFeatureTypesState['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

const AdminFeatureTypesListPresenter = ({
  View,
  adminFeatureTypesState: { isListLoading, entities: featureTypes, get: getFeatureTypes, hasListLoaded },
}: Props) => {
  React.useEffect(() => {
    getFeatureTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} featureTypes={featureTypes} />;
};

export default AdminFeatureTypesListPresenter;
