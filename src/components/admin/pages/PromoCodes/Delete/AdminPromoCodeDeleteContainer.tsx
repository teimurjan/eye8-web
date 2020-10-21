import * as React from 'react';

import { DeleteModalContainer } from 'src/components/admin/table/DeleteModal/DeleteModalContainer';
import { useDependencies } from 'src/DI/DI';
import * as promoCodeService from 'src/services/PromoCodeService';
import { useAdminPromoCodesState } from 'src/state/Admin/AdminPromoCodesState';

const getErrorMessageID = (e: Error) => {
  if (e instanceof promoCodeService.errors.PromoCodeHasOrders) {
    return 'AdminPromoCodes.errors.hasOrders';
  }

  return 'errors.common';
};

export const AdminPromoCodesDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    state: { remove: deletePromoCode },
  } = useAdminPromoCodesState();

  return (
    <DeleteModalContainer
      getErrorMessageID={getErrorMessageID}
      deleteEntity={async ({ id, deleted }) => {
        await dependencies.services.promoCode.delete(id, deleted);
        deletePromoCode(id);
      }}
      checkExistence={({ id, deleted }) => dependencies.services.promoCode.exists(id, deleted)}
      getBackPath={() => `/admin/promoCodes`}
    />
  );
};
