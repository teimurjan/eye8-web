import React from 'react';

import { CharacteristicValue } from '@eye8/api';
import { makeEntityState, EntityContextValue } from '@eye8/shared/utils';

export type ContextValue = EntityContextValue<CharacteristicValue<true>>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminCharacteristicValuesStateProvider = makeEntityState(
  Context,
  (d) => d.di.service.characteristicValue.getAllRawIntl(),
  'characteristicValues',
);

export const useAdminCharacteristicValuesState = () => React.useContext(Context) as ContextValue;
