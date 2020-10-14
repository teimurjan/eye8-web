import * as React from 'react';

import { AdminRatesListPresenter } from 'src/components/Admin/Rates/List/AdminRatesListPresenter';
import { AdminRatesListView } from 'src/components/Admin/Rates/List/AdminRatesListView';
import { useAdminRatesState } from 'src/state/AdminRatesState';

export const AdminRatesListContainer = () => {
  const { state: adminRatesState } = useAdminRatesState();

  return <AdminRatesListPresenter View={AdminRatesListView} adminRatesState={adminRatesState} />;
};
