import * as React from 'react';

import { AdminRatesListPresenter } from 'src/components/admin/pages/Rates/List/AdminRatesListPresenter';
import { AdminRatesListView } from 'src/components/admin/pages/Rates/List/AdminRatesListView';
import { useAdminRatesState } from 'src/state/Admin/AdminRatesState';

export const AdminRatesListContainer = () => {
  const { state: adminRatesState } = useAdminRatesState();

  return <AdminRatesListPresenter View={AdminRatesListView} adminRatesState={adminRatesState} />;
};
