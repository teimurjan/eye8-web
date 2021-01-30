import React from 'react';

import { AdminRatesListPresenter } from '@eye8/admin/pages/rates/list/presenter';
import { AdminRatesListView } from '@eye8/admin/pages/rates/list/view';

import { useAdminRatesState } from '../../../state';

export const AdminRatesListContainer = () => {
  const adminRatesState = useAdminRatesState();

  return <AdminRatesListPresenter View={AdminRatesListView} adminRatesState={adminRatesState} />;
};
