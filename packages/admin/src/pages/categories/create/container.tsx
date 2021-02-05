import React from 'react';
import { useHistory } from 'react-router';

import { useAdminCategoriesState } from '@eye8/admin/state';
import { useDI } from '@eye8/di';

import AdminCategoriesCreatePresenter from './presenter';
import AdminCategoriesCreateView from './view';

const AdminCategoriesCreateContainer = () => {
  const history = useHistory();

  const { di } = useDI();
  const adminCategoriesState = useAdminCategoriesState();

  return (
    <AdminCategoriesCreatePresenter
      history={history}
      View={AdminCategoriesCreateView}
      service={di.service.category}
      adminCategoriesState={adminCategoriesState}
    />
  );
};

export default AdminCategoriesCreateContainer;
