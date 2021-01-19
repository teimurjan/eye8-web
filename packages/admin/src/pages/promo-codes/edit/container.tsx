import React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminPromoCodesEditPresenter } from '@eye8/admin/pages/promo-codes/edit/presenter';
import { AdminPromoCodesEditView } from '@eye8/admin/pages/promo-codes/edit/view';
import { useAdminPromoCodesState } from '@eye8/admin/state/promo-codes';
import { useDI } from '@eye8/di';

export const AdminPromoCodesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { di } = useDI();
  const { state: adminPromoCodesState } = useAdminPromoCodesState();

  return (
    <AdminPromoCodesEditPresenter
      promoCodeId={parseInt(params.id, 10)}
      history={history}
      View={AdminPromoCodesEditView}
      service={di.service.promoCode}
      productService={di.service.product}
      adminPromoCodesState={adminPromoCodesState}
    />
  );
};
