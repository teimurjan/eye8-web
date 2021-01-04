import React from 'react';

import { AdminPage } from '@eye8/admin/components/page';
import { AdminFeatureValuesCreateContainer } from '@eye8/admin/pages/feature-values/create/container';
import { AdminFeatureValuesDeleteContainer } from '@eye8/admin/pages/feature-values/delete/container';
import { AdminFeatureValuesEditContainer } from '@eye8/admin/pages/feature-values/edit/container';
import { AdminFeatureValuesListContainer } from '@eye8/admin/pages/feature-values/list/container';

export const AdminFeatureValues = () => (
  <AdminPage
    ListComponent={AdminFeatureValuesListContainer}
    CreateComponent={AdminFeatureValuesCreateContainer}
    EditComponent={AdminFeatureValuesEditContainer}
    DeleteComponent={AdminFeatureValuesDeleteContainer}
  />
);
