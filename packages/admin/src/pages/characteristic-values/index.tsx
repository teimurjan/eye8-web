import React from 'react';

import { AdminPage } from '@eye8/admin/components/page';
import { AdminCharacteristicValuesCreateContainer } from '@eye8/admin/pages/characteristic-values/create/container';
import { AdminCharacteristicValuesDeleteContainer } from '@eye8/admin/pages/characteristic-values/delete/container';
import { AdminCharacteristicValuesEditContainer } from '@eye8/admin/pages/characteristic-values/edit/container';
import { AdminCharacteristicValuesListContainer } from '@eye8/admin/pages/characteristic-values/list/container';

export const AdminCharacteristicValues = () => (
  <AdminPage
    ListComponent={AdminCharacteristicValuesListContainer}
    CreateComponent={AdminCharacteristicValuesCreateContainer}
    EditComponent={AdminCharacteristicValuesEditContainer}
    DeleteComponent={AdminCharacteristicValuesDeleteContainer}
  />
);
