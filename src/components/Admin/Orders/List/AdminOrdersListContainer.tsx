import * as React from 'react';
import { injectIntl } from 'react-intl';

import { AdminOrdersListPresenter } from 'src/components/Admin/Orders/List/AdminOrdersListPresenter';
import { AdminOrdersListView } from 'src/components/Admin/Orders/List/AdminOrdersListView';
import { useAdminOrdersState } from 'src/state/AdminOrdersState';
import { useIntlState } from 'src/state/IntlState';

const View = injectIntl(AdminOrdersListView);

export const AdminOrdersListContainer = () => {
  const { intlState } = useIntlState();
  const { state: adminOrdersState } = useAdminOrdersState();

  return <AdminOrdersListPresenter View={View} adminOrdersState={adminOrdersState} intlState={intlState} />;
};
