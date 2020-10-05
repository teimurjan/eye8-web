import * as React from 'react';

import { ICharacteristicValueListRawIntlResponseItem } from 'src/api/CharacteristicValueAPI';
import { extendIntlTextWithLocaleNames } from 'src/helpers/intl';
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
  (characteristicValue, { availableLocales }) => ({
    ...characteristicValue,
    name: extendIntlTextWithLocaleNames(characteristicValue.name, availableLocales),
    characteristic: {
      ...characteristicValue.characteristic,
      name: extendIntlTextWithLocaleNames(characteristicValue.characteristic.name, availableLocales),
    },
  }),
);

export const useAdminCharacteristicValuesState = () => React.useContext(Context) as ContextValue;
