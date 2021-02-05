import React from 'react';

import { AdminCharacteristicValuesState } from '../../../state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  adminCharacteristicValuesState: AdminCharacteristicValuesState;
}

export interface ViewProps {
  characteristicValues: AdminCharacteristicValuesState['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

const AdminCharacteristicValuesListPresenter = ({
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

export default AdminCharacteristicValuesListPresenter;
