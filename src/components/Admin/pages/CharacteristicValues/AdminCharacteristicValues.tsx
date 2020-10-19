import * as React from 'react';

import { AdminPage } from 'src/components/admin/AdminPage/AdminPage';
import { AdminCharacteristicValuesCreateContainer } from 'src/components/admin/pages/CharacteristicValues/Create/AdminCharacteristicValuesCreateContainer';
import { AdminCharacteristicValuesDeleteContainer } from 'src/components/admin/pages/CharacteristicValues/Delete/AdminCharacteristicValuesDeleteContainer';
import { AdminCharacteristicValuesEditContainer } from 'src/components/admin/pages/CharacteristicValues/Edit/AdminCharacteristicValuesEditContainer';
import { AdminCharacteristicValuesListContainer } from 'src/components/admin/pages/CharacteristicValues/List/AdminCharacteristicValuesListContainer';

export const AdminCharacteristicValues = () => (
  <AdminPage
    ListComponent={AdminCharacteristicValuesListContainer}
    CreateComponent={AdminCharacteristicValuesCreateContainer}
    EditComponent={AdminCharacteristicValuesEditContainer}
    DeleteComponent={AdminCharacteristicValuesDeleteContainer}
  />
);
