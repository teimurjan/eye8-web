import * as React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminPromoCodesEditPresenter } from 'src/components/Admin/PromoCodes/Edit/AdminPromoCodesEditPresenter';
import { AdminPromoCodesEditView } from 'src/components/Admin/PromoCodes/Edit/AdminPromoCodesEditView';
import { useDependencies } from 'src/DI/DI';
import { useAdminPromoCodesState } from 'src/state/AdminPromoCodesState';

export const AdminPromoCodesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { state: adminPromoCodesState } = useAdminPromoCodesState();

  return (
    <AdminPromoCodesEditPresenter
      promoCodeId={parseInt(params.id, 10)}
      history={history}
      View={AdminPromoCodesEditView}
      service={dependencies.services.promoCode}
      productService={dependencies.services.product}
      adminPromoCodesState={adminPromoCodesState}
    />
  );
};
