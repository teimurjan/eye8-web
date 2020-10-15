import * as React from 'react';

import { AdminPromoCodesListPresenter } from 'src/components/Admin/PromoCodes/List/AdminPromoCodesListPresenter';
import { AdminPromoCodesListView } from 'src/components/Admin/PromoCodes/List/AdminPromoCodesListView';
import { useAdminPromoCodesState } from 'src/state/Admin/AdminPromoCodesState';

export const AdminPromoCodesListContainer = () => {
  const { state: adminPromoCodesState } = useAdminPromoCodesState();

  return <AdminPromoCodesListPresenter View={AdminPromoCodesListView} adminPromoCodesState={adminPromoCodesState} />;
};
