import React from 'react';

import { useDI } from '@eye8/di';
import { PromoCodeHasOrdersError } from '@eye8/service/promo-code';

import { DeleteModal } from '../../../components';
import { useAdminPromoCodesState } from '../../../state';

const getErrorMessageID = (e: Error) => {
  if (e instanceof PromoCodeHasOrdersError) {
    return 'AdminPromoCodes.errors.hasOrders';
  }

  return 'errors.common';
};

const AdminPromoCodesDeleteContainer = () => {
  const { di } = useDI();
  const { remove: deletePromoCode } = useAdminPromoCodesState();

  return (
    <DeleteModal
      getErrorMessageID={getErrorMessageID}
      deleteEntity={async ({ id, deleted }) => {
        await di.service.promoCode.delete(id, deleted);
        deletePromoCode(id);
      }}
      checkExistence={({ id, deleted }) => di.service.promoCode.exists(id, deleted)}
      getBackPath={() => `/admin/promoCodes`}
    />
  );
};

export default AdminPromoCodesDeleteContainer;
