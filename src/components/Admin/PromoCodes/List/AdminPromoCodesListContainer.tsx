import * as React from 'react';

import { AdminPromoCodesListPresenter } from 'src/components/Admin/PromoCodes/List/AdminPromoCodesListPresenter';
import { AdminPromoCodesListView } from 'src/components/Admin/PromoCodes/List/AdminPromoCodesListView';
import { useShowDeleted } from 'src/components/Admin/PromoCodes/List/useShowDeleted';
import { useAdminPromoCodesState } from 'src/state/AdminPromoCodesState';

export const AdminPromoCodesListContainer = () => {
  const { state: adminPromoCodesState } = useAdminPromoCodesState();

  const showDeleted = useShowDeleted();

  return (
    <AdminPromoCodesListPresenter
      showDeleted={showDeleted}
      View={AdminPromoCodesListView}
      adminPromoCodesState={adminPromoCodesState}
    />
  );
};
