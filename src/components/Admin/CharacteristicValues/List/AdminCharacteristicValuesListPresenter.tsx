import * as React from 'react';

import { ContextValue as AdminCharacteristicValuesStateContextValue } from 'src/state/AdminCharacteristicValuesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminCharacteristicValuesState: AdminCharacteristicValuesStateContextValue['state'];
}

export interface IViewProps {
  characteristicValues: AdminCharacteristicValuesStateContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
  locales: string[];
}

export const AdminCharacteristicValuesListPresenter = ({
  View,
  adminCharacteristicValuesState: {
    isListLoading,
    entities: characteristicValues,
    get: getCharacteristicValues,
    hasListLoaded,
  },
  intlState: { availableLocales },
}: IProps & IntlStateContextValue) => {
  React.useEffect(() => {
    getCharacteristicValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      isDataLoaded={hasListLoaded}
      isLoading={isListLoading}
      locales={availableLocales.map(({ name }) => name)}
      characteristicValues={characteristicValues}
    />
  );
};
