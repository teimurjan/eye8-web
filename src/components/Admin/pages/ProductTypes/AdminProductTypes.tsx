import * as React from 'react';

import { AdminPage } from 'src/components/admin/pages/AdminPage';
import { AdminProductTypesCreateContainer } from 'src/components/admin/pages/ProductTypes/Create/AdminProductTypesCreateContainer';
import { AdminProductTypesDeleteContainer } from 'src/components/admin/pages/ProductTypes/Delete/AdminProductTypesDeleteContainer';
import { AdminProductTypesEditContainer } from 'src/components/admin/pages/ProductTypes/Edit/AdminProductTypesEditContainer';
import { AdminProductTypesListContainer } from 'src/components/admin/pages/ProductTypes/List/AdminProductTypesListContainer';

export const AdminProductTypes = () => (
  <AdminPage
    ListComponent={AdminProductTypesListContainer}
    CreateComponent={AdminProductTypesCreateContainer}
    EditComponent={AdminProductTypesEditContainer}
    DeleteComponent={AdminProductTypesDeleteContainer}
  />
);
