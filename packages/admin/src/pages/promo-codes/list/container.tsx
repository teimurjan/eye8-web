import React from 'react';

import { useAdminPromoCodesState } from '../../../state';

import AdminPromoCodesListPresenter from './presenter';
import AdminPromoCodesListView from './view';

const AdminPromoCodesListContainer = () => {
  const adminPromoCodesState = useAdminPromoCodesState();

  return <AdminPromoCodesListPresenter View={AdminPromoCodesListView} adminPromoCodesState={adminPromoCodesState} />;
};

export default AdminPromoCodesListContainer;
