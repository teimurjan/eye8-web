import React from 'react';

import { CharacteristicValueListRawIntlResponseItem } from '@eye8/api/characteristic-value';
import { makeEntityState, EntityContextValue } from '@eye8/shared/utils';

export type ContextValue = EntityContextValue<
  CharacteristicValueListRawIntlResponseItem,
  CharacteristicValueListRawIntlResponseItem
>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminCharacteristicValuesStateProvider = makeEntityState(
  Context,
  (d) => d.di.service.characteristicValue.getAllRawIntl(),
  'characteristicValues',
);

export const useAdminCharacteristicValuesState = () => React.useContext(Context) as ContextValue;
