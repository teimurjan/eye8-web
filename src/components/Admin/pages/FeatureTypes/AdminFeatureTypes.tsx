import * as React from 'react';

import { AdminPage } from 'src/components/admin/pages/AdminPage';
import { AdminFeatureTypesCreateContainer } from 'src/components/admin/pages/FeatureTypes/Create/AdminFeatureTypesCreateContainer';
import { AdminFeatureTypesDeleteContainer } from 'src/components/admin/pages/FeatureTypes/Delete/AdminFeatureTypesDeleteContainer';
import { AdminFeatureTypesEditContainer } from 'src/components/admin/pages/FeatureTypes/Edit/AdminFeatureTypesEditContainer';
import { AdminFeatureTypesListContainer } from 'src/components/admin/pages/FeatureTypes/List/AdminFeatureTypesListContainer';

export const AdminFeatureTypes = () => (
  <AdminPage
    ListComponent={AdminFeatureTypesListContainer}
    CreateComponent={AdminFeatureTypesCreateContainer}
    EditComponent={AdminFeatureTypesEditContainer}
    DeleteComponent={AdminFeatureTypesDeleteContainer}
  />
);
