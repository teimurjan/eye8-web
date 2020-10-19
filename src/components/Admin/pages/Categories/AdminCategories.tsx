import * as React from 'react';

import { AdminPage } from 'src/components/admin/AdminPage/AdminPage';
import { AdminCategoriesCreateContainer } from 'src/components/admin/pages/Categories/Create/AdminCategoriesCreateContainer';
import { AdminCategoriesDeleteContainer } from 'src/components/admin/pages/Categories/Delete/AdminCategoriesDeleteContainer';
import { AdminCategoriesEditContainer } from 'src/components/admin/pages/Categories/Edit/AdminCategoriesEditContainer';
import { AdminCategoriesListContainer } from 'src/components/admin/pages/Categories/List/AdminCategoriesListContainer';

export const AdminCategories = () => (
  <AdminPage
    ListComponent={AdminCategoriesListContainer}
    CreateComponent={AdminCategoriesCreateContainer}
    EditComponent={AdminCategoriesEditContainer}
    DeleteComponent={AdminCategoriesDeleteContainer}
  />
);
