import * as React from 'react';

import { ContextValue as AdminCharacteristicValuesStateContextValue } from 'src/state/AdminCharacteristicValuesState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminCharacteristicValuesState: AdminCharacteristicValuesStateContextValue['state'];
}

export interface IViewProps {
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
}: IProps) => {
  React.useEffect(() => {
    getCharacteristicValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} characteristicValues={characteristicValues} />;
};
