import React from 'react';

import { ICharacteristicValueListRawIntlResponseItem } from '@eye8/api/characteristic-value';
import { makeEntityState, IContextValue } from '@eye8/shared/utils';

export type ContextValue = IContextValue<
  ICharacteristicValueListRawIntlResponseItem,
  ICharacteristicValueListRawIntlResponseItem
>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminCharacteristicValuesStateProvider = makeEntityState(
  Context,
  (d) => d.dependencies.services.characteristicValue.getAllRawIntl(),
  'characteristicValues',
);

export const useAdminCharacteristicValuesState = () => React.useContext(Context) as ContextValue;
