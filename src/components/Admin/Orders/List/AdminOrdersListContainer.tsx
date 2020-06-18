import * as React from 'react';
import { injectIntl } from 'react-intl';

import { AdminOrdersListPresenter } from 'src/components/Admin/Orders/List/AdminOrdersListPresenter';
import { AdminOrdersListView } from 'src/components/Admin/Orders/List/AdminOrdersListView';
import { useAdminOrdersState } from 'src/state/AdminOrdersState';
import { useIntlState } from 'src/state/IntlState';

export const AdminOrdersListContainer = () => {
  const { intlState } = useIntlState();
  const { adminOrdersState } = useAdminOrdersState();

  return (
    <AdminOrdersListPresenter
      View={injectIntl(AdminOrdersListView)}
      adminOrdersState={adminOrdersState}
      intlState={intlState}
    />
  );
};
