import * as React from 'react';

import { ICharacteristicListRawIntlResponseItem } from 'src/api/CharacteristicAPI';
import { makeEntityState, IContextValue } from 'src/state/makeEntityState';

export type ContextValue = IContextValue<
  ICharacteristicListRawIntlResponseItem,
  ICharacteristicListRawIntlResponseItem
>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminCharacteristicsStateProvider = makeEntityState(
  Context,
  (d) => d.dependencies.services.characteristic.getAllRawIntl(),
  'characteristics',
);

export const useAdminCharacteristicsState = () => React.useContext(Context) as ContextValue;
