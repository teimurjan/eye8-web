import React from 'react';

import { AdminPage } from '@eye8/admin/components/page';
import { AdminProductTypesCreateContainer } from '@eye8/admin/pages/product-types/create/container';
import { AdminProductTypesDeleteContainer } from '@eye8/admin/pages/product-types/delete/container';
import { AdminProductTypesEditContainer } from '@eye8/admin/pages/product-types/edit/container';
import { AdminProductTypesListContainer } from '@eye8/admin/pages/product-types/list/container';

export const AdminProductTypes = () => (
  <AdminPage
    ListComponent={AdminProductTypesListContainer}
    CreateComponent={AdminProductTypesCreateContainer}
    EditComponent={AdminProductTypesEditContainer}
    DeleteComponent={AdminProductTypesDeleteContainer}
  />
);
