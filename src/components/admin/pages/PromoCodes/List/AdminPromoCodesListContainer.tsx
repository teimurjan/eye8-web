import * as React from 'react';

import { AdminPromoCodesListPresenter } from 'src/components/admin/pages/PromoCodes/List/AdminPromoCodesListPresenter';
import { AdminPromoCodesListView } from 'src/components/admin/pages/PromoCodes/List/AdminPromoCodesListView';
import { useAdminPromoCodesState } from 'src/state/Admin/AdminPromoCodesState';

export const AdminPromoCodesListContainer = () => {
  const { state: adminPromoCodesState } = useAdminPromoCodesState();

  return <AdminPromoCodesListPresenter View={AdminPromoCodesListView} adminPromoCodesState={adminPromoCodesState} />;
};
