import * as React from 'react';

import { AdminRatesListPresenter } from 'src/components/Admin/Rates/List/AdminRatesListPresenter';
import { AdminRatesListView } from 'src/components/Admin/Rates/List/AdminRatesListView';
import { useAdminRatesState } from 'src/state/AdminRatesState';
import { useIntlState } from 'src/state/IntlState';

export const AdminRatesListContainer = () => {
  const { intlState } = useIntlState();
  const { state: adminRatesState } = useAdminRatesState();

  return <AdminRatesListPresenter View={AdminRatesListView} adminRatesState={adminRatesState} intlState={intlState} />;
};
