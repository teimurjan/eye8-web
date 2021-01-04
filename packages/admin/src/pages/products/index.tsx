import React from 'react';

import { AdminPage } from '@eye8/admin/components/page';
import { AdminProductsCreateContainer } from '@eye8/admin/pages/products/create/container';
import { AdminProductsDeleteContainer } from '@eye8/admin/pages/products/delete/container';
import { AdminProductsEditContainer } from '@eye8/admin/pages/products/edit/container';
import { AdminProductsListContainer } from '@eye8/admin/pages/products/list/container';

export const AdminProducts = () => (
  <AdminPage
    ListComponent={AdminProductsListContainer}
    CreateComponent={AdminProductsCreateContainer}
    EditComponent={AdminProductsEditContainer}
    DeleteComponent={AdminProductsDeleteContainer}
  />
);
