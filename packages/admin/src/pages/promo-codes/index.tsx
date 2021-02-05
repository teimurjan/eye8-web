import React from 'react';

import { Page } from '../../components';

import AdminPromoCodesCreate from './create';
import AdminPromoCodesDelete from './delete';
import AdminPromoCodesEdit from './edit';
import AdminPromoCodesList from './list';

const AdminPromoCodes = () => (
  <Page
    ListComponent={AdminPromoCodesList}
    CreateComponent={AdminPromoCodesCreate}
    EditComponent={AdminPromoCodesEdit}
    DeleteComponent={AdminPromoCodesDelete}
  />
);

export default AdminPromoCodes;
