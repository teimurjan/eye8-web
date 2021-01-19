import React from 'react';

import { DeleteModalContainer } from '@eye8/admin/components/delete-modal/container';
import { useAdminPromoCodesState } from '@eye8/admin/state/promo-codes';
import { useDI } from '@eye8/di';
import { PromoCodeHasOrdersError } from '@eye8/service/promo-code';

const getErrorMessageID = (e: Error) => {
  if (e instanceof PromoCodeHasOrdersError) {
    return 'AdminPromoCodes.errors.hasOrders';
  }

  return 'errors.common';
};

export const AdminPromoCodesDeleteContainer = () => {
  const { di } = useDI();
  const {
    state: { remove: deletePromoCode },
  } = useAdminPromoCodesState();

  return (
    <DeleteModalContainer
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
