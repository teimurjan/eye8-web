import React from 'react';

import { Page } from '../../components';

import AdminProductTypesCreate from './create';
import AdminProductTypesDelete from './delete';
import AdminProductTypesEdit from './edit';
import AdminProductTypesList from './list';

const AdminProductTypes = () => (
  <Page
    ListComponent={AdminProductTypesList}
    CreateComponent={AdminProductTypesCreate}
    EditComponent={AdminProductTypesEdit}
    DeleteComponent={AdminProductTypesDelete}
  />
);

export default AdminProductTypes;
export { NewProductTypeButton } from './list'