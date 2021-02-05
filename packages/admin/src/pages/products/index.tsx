import React from 'react';

import { Page } from '../../components';

import AdminProductsCreate from './create';
import AdminProductsDelete from './delete';
import AdminProductsEdit from './edit';
import AdminProductsList from './list';

const AdminProducts = () => (
  <Page
    ListComponent={AdminProductsList}
    CreateComponent={AdminProductsCreate}
    EditComponent={AdminProductsEdit}
    DeleteComponent={AdminProductsDelete}
  />
);

export default AdminProducts;
export { NewProductButton } from './list';
