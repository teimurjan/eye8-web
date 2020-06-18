import * as React from 'react';

import { AdminPromoCodesListPresenter } from 'src/components/Admin/PromoCodes/List/AdminPromoCodesListPresenter';
import { AdminPromoCodesListView } from 'src/components/Admin/PromoCodes/List/AdminPromoCodesListView';
import { useAdminPromoCodesState } from 'src/state/AdminPromoCodesState';
import { useIntlState } from 'src/state/IntlState';

export const AdminPromoCodesListContainer = () => {
  const { intlState } = useIntlState();
  const { adminPromoCodesState } = useAdminPromoCodesState();

  return (
    <AdminPromoCodesListPresenter
      View={AdminPromoCodesListView}
      adminPromoCodesState={adminPromoCodesState}
      intlState={intlState}
    />
  );
};
