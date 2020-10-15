import * as React from 'react';

import { ICharacteristicValueListRawIntlResponseItem } from 'src/api/CharacteristicValueAPI';
import { makeEntityState, IContextValue } from 'src/state/makeEntityState';

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
