import React from 'react';

import { AdminPage } from '@eye8/admin/components/page';
import { AdminCategoriesCreateContainer } from '@eye8/admin/pages/categories/create/container';
import { AdminCategoriesDeleteContainer } from '@eye8/admin/pages/categories/delete/container';
import { AdminCategoriesEditContainer } from '@eye8/admin/pages/categories/edit/container';
import { AdminCategoriesListContainer } from '@eye8/admin/pages/categories/list/container';

export const AdminCategories = () => (
  <AdminPage
    ListComponent={AdminCategoriesListContainer}
    CreateComponent={AdminCategoriesCreateContainer}
    EditComponent={AdminCategoriesEditContainer}
    DeleteComponent={AdminCategoriesDeleteContainer}
  />
);
