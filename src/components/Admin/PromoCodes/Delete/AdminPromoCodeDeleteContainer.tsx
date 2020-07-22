import * as React from 'react';

import { DeleteModalContainer } from 'src/components/Admin/DeleteModal/DeleteModalContainer';
import { useDependencies } from 'src/DI/DI';
import * as promoCodeService from 'src/services/PromoCodeService';
import { useAdminPromoCodesState } from 'src/state/AdminPromoCodesState';

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

  const deleteEntity = React.useCallback(
    async (id: number) => {
      await dependencies.services.promoCode.delete(id);
      deletePromoCode(id);
    },
    [deletePromoCode, dependencies.services.promoCode],
  );

  const preloadData = React.useCallback(
    async ({ id, setError, setIsLoading }) => {
      try {
        setIsLoading(true);
        const isExists = await dependencies.services.promoCode.exists(id);
        if (!isExists) {
          setError('AdminPromoCodes.notFound');
        }
      } catch (e) {
        setError('errors.common');
      } finally {
        setIsLoading(false);
      }
    },
    [dependencies.services.promoCode],
  );

  return (
    <DeleteModalContainer
      getErrorMessageID={getErrorMessageID}
      deleteEntity={deleteEntity}
      preloadData={preloadData}
      backPath="/admin/promoCodes"
    />
  );
};
