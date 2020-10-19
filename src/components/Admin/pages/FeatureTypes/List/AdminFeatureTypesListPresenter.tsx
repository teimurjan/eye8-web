import * as React from 'react';

import { ContextValue as AdminFeatureTypesContextValue } from 'src/state/Admin/AdminFeatureTypesState';

export interface IProps {
  View: React.ComponentType<IViewProps>;
  adminFeatureTypesState: AdminFeatureTypesContextValue['state'];
}

export interface IViewProps {
  featureTypes: AdminFeatureTypesContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

export const AdminFeatureTypesListPresenter = ({
  View,
  adminFeatureTypesState: { isListLoading, entities: featureTypes, get: getFeatureTypes, hasListLoaded },
}: IProps) => {
  React.useEffect(() => {
    getFeatureTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} featureTypes={featureTypes} />;
};
