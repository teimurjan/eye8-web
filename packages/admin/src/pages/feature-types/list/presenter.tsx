import React from 'react';

import { ContextValue as AdminFeatureTypesContextValue } from '@eye8/admin/state/feature-types';

export interface Props {
  View: React.ComponentType<ViewProps>;
  adminFeatureTypesState: AdminFeatureTypesContextValue['state'];
}

export interface ViewProps {
  featureTypes: AdminFeatureTypesContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

export const AdminFeatureTypesListPresenter = ({
  View,
  adminFeatureTypesState: { isListLoading, entities: featureTypes, get: getFeatureTypes, hasListLoaded },
}: Props) => {
  React.useEffect(() => {
    getFeatureTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} featureTypes={featureTypes} />;
};
