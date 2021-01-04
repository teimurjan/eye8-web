import React from 'react';

import { ICharacteristicListRawIntlResponseItem } from '@eye8/api/characteristic';
import { makeEntityState, IContextValue } from '@eye8/shared/utils';

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
