import React from 'react';

import { AdminRatesListPresenter } from '@eye8/admin/pages/rates/list/presenter';
import { AdminRatesListView } from '@eye8/admin/pages/rates/list/view';
import { useAdminRatesState } from '@eye8/admin/state/rates';

export const AdminRatesListContainer = () => {
  const { state: adminRatesState } = useAdminRatesState();

  return <AdminRatesListPresenter View={AdminRatesListView} adminRatesState={adminRatesState} />;
};
