import React from 'react';

import { useAdminRatesState } from '../../../state';

import AdminRatesListPresenter from './presenter';
import AdminRatesListView from './view';


const AdminRatesListContainer = () => {
  const adminRatesState = useAdminRatesState();

  return <AdminRatesListPresenter View={AdminRatesListView} adminRatesState={adminRatesState} />;
};

export default AdminRatesListContainer;
