import React from 'react';

import { ContextValue as AdminCharacteristicValuesStateContextValue } from '@eye8/admin/state/characteristic-values';

export interface Props {
  View: React.ComponentType<ViewProps>;
  adminCharacteristicValuesState: AdminCharacteristicValuesStateContextValue['state'];
}

export interface ViewProps {
  characteristicValues: AdminCharacteristicValuesStateContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

export const AdminCharacteristicValuesListPresenter = ({
  View,
  adminCharacteristicValuesState: {
    isListLoading,
    entities: characteristicValues,
    get: getCharacteristicValues,
    hasListLoaded,
  },
}: Props) => {
  React.useEffect(() => {
    getCharacteristicValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} characteristicValues={characteristicValues} />;
};
