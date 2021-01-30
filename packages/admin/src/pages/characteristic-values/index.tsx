import React from 'react';

import { AdminCharacteristicValuesCreateContainer } from '@eye8/admin/pages/characteristic-values/create/container';
import { AdminCharacteristicValuesDeleteContainer } from '@eye8/admin/pages/characteristic-values/delete/container';
import { AdminCharacteristicValuesEditContainer } from '@eye8/admin/pages/characteristic-values/edit/container';
import { AdminCharacteristicValuesListContainer } from '@eye8/admin/pages/characteristic-values/list/container';

import { Page } from '../../components';

export const AdminCharacteristicValues = () => (
  <Page
    ListComponent={AdminCharacteristicValuesListContainer}
    CreateComponent={AdminCharacteristicValuesCreateContainer}
    EditComponent={AdminCharacteristicValuesEditContainer}
    DeleteComponent={AdminCharacteristicValuesDeleteContainer}
  />
);
