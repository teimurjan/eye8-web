import React from 'react';

import { AdminPage } from '@eye8/admin/components/page';
import { AdminCharacteristicsCreateContainer } from '@eye8/admin/pages/characteristics/create/container';
import { AdminCharacteristicsDeleteContainer } from '@eye8/admin/pages/characteristics/delete/container';
import { AdminCharacteristicsEditContainer } from '@eye8/admin/pages/characteristics/edit/container';
import { AdminCharacteristicsListContainer } from '@eye8/admin/pages/characteristics/list/container';

export const AdminCharacteristics = () => (
  <AdminPage
    ListComponent={AdminCharacteristicsListContainer}
    CreateComponent={AdminCharacteristicsCreateContainer}
    EditComponent={AdminCharacteristicsEditContainer}
    DeleteComponent={AdminCharacteristicsDeleteContainer}
  />
);
