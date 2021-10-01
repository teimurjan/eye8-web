import React from 'react';

import { Page } from '../../components';

import AdminCategoriesCreate from './create';
import AdminCategoriesDelete from './delete';
import AdminCategoriesEdit from './edit';
import AdminCategoriesList from './list';

const AdminCategories = () => (
  <Page
    ListComponent={AdminCategoriesList}
    CreateComponent={AdminCategoriesCreate}
    EditComponent={AdminCategoriesEdit}
    DeleteComponent={AdminCategoriesDelete}
  />
);

export default AdminCategories;
