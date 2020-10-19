import * as React from 'react';

import { AdminPage } from 'src/components/admin/AdminPage/AdminPage';
import { AdminFeatureValuesCreateContainer } from 'src/components/admin/pages/FeatureValues/Create/AdminFeatureValuesCreateContainer';
import { AdminFeatureValuesDeleteContainer } from 'src/components/admin/pages/FeatureValues/Delete/AdminFeatureValuesDeleteContainer';
import { AdminFeatureValuesEditContainer } from 'src/components/admin/pages/FeatureValues/Edit/AdminFeatureValuesEditContainer';
import { AdminFeatureValuesListContainer } from 'src/components/admin/pages/FeatureValues/List/AdminFeatureValuesListContainer';

export const AdminFeatureValues = () => (
  <AdminPage
    ListComponent={AdminFeatureValuesListContainer}
    CreateComponent={AdminFeatureValuesCreateContainer}
    EditComponent={AdminFeatureValuesEditContainer}
    DeleteComponent={AdminFeatureValuesDeleteContainer}
  />
);
