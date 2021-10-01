import React from 'react';

import { useDI } from '@eye8/di';
import { PromoCodeDeletionWithOrdersError } from '@eye8/service';
import { buildSearchString } from '@eye8/shared/utils';

import { DeleteModal } from '../../../components';
import { useAdminPromoCodesFilters } from '../../../hooks';
import { useAdminPromoCodesState } from '../../../state';

const getErrorMessageID = (e: Error) => {
  if (e instanceof PromoCodeDeletionWithOrdersError) {
    return 'AdminPromoCodes.errors.hasOrders';
  }

  return 'errors.common';
};

const AdminPromoCodesDeleteContainer = () => {
  const { di } = useDI();
  const { remove: deletePromoCode } = useAdminPromoCodesState();
  const {
    filters: { deleted },
  } = useAdminPromoCodesFilters();

  return (
    <DeleteModal
      getErrorMessageID={getErrorMessageID}
      deleteEntity={async ({ id }) => {
        await di.service.promoCode.delete(id, deleted);
        deletePromoCode(id);
      }}
      checkExistence={({ id }) => di.service.promoCode.exists(id, deleted)}
      getBackPath={() => `/admin/promoCodes${buildSearchString({ deleted })}`}
    />
  );
};

export default AdminPromoCodesDeleteContainer;
