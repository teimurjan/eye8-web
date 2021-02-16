import React from 'react';

import { Characteristic } from '@eye8/api';
import { makeEntityState, EntityContextValue } from '@eye8/shared/utils';

export type ContextValue = EntityContextValue<Characteristic<true>>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminCharacteristicsStateProvider = makeEntityState(
  Context,
  (d) => d.di.service.characteristic.getAllRawIntl(),
  'characteristics',
);

export const useAdminCharacteristicsState = () => React.useContext(Context) as ContextValue;
