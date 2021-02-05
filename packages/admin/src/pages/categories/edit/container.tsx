import React from 'react';
import { useHistory, useParams } from 'react-router';

import { useDI } from '@eye8/di';

import { useAdminCategoriesState } from '../../../state';

import AdminCategoriesEditPresenter from './presenter';
import AdminCategoriesEditView from './view';


const AdminCategoriesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { di } = useDI();
  const adminCategoriesState = useAdminCategoriesState();

  return (
    <AdminCategoriesEditPresenter
      categoryId={parseInt(params.id, 10)}
      history={history}
      View={AdminCategoriesEditView}
      service={di.service.category}
      adminCategoriesState={adminCategoriesState}
    />
  );
};

export default AdminCategoriesEditContainer;
