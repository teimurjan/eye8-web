import * as React from 'react';

import { AdminPage } from 'src/components/admin/pages/AdminPage';
import { AdminProductsCreateContainer } from 'src/components/admin/pages/Products/Create/AdminProductsCreateContainer';
import { AdminProductsDeleteContainer } from 'src/components/admin/pages/Products/Delete/AdminProductsDeleteContainer';
import { AdminProductsEditContainer } from 'src/components/admin/pages/Products/Edit/AdminProductsEditContainer';
import { AdminProductsListContainer } from 'src/components/admin/pages/Products/List/AdminProductsListContainer';

export const AdminProducts = () => (
  <AdminPage
    ListComponent={AdminProductsListContainer}
    CreateComponent={AdminProductsCreateContainer}
    EditComponent={AdminProductsEditContainer}
    DeleteComponent={AdminProductsDeleteContainer}
  />
);
