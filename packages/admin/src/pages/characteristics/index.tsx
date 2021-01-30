import React from 'react';

import { AdminCharacteristicsCreateContainer } from '@eye8/admin/pages/characteristics/create/container';
import { AdminCharacteristicsDeleteContainer } from '@eye8/admin/pages/characteristics/delete/container';
import { AdminCharacteristicsEditContainer } from '@eye8/admin/pages/characteristics/edit/container';
import { AdminCharacteristicsListContainer } from '@eye8/admin/pages/characteristics/list/container';

import { Page } from '../../components';

export const AdminCharacteristics = () => (
  <Page
    ListComponent={AdminCharacteristicsListContainer}
    CreateComponent={AdminCharacteristicsCreateContainer}
    EditComponent={AdminCharacteristicsEditContainer}
    DeleteComponent={AdminCharacteristicsDeleteContainer}
  />
);
