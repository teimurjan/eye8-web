import React from 'react';

import { DeleteModalContainer } from '@eye8/admin/components/delete-modal/container';
import { useAdminRatesState } from '@eye8/admin/state/rates';
import { useDI } from '@eye8/di';
import { RateHasOrdersError } from '@eye8/service/rate';

const getErrorMessageID = (e: Error) => {
  if (e instanceof RateHasOrdersError) {
    return 'AdminRates.errors.hasOrders';
  }

  return 'errors.common';
};

export const AdminRatesDeleteContainer = () => {
  const { di } = useDI();
  const {
    state: { remove: deleteRate },
  } = useAdminRatesState();

  return (
    <DeleteModalContainer
      getErrorMessageID={getErrorMessageID}
      deleteEntity={async ({ id, deleted }) => {
        await di.service.rate.delete(id);
        deleteRate(id);
      }}
      checkExistence={({ id, deleted }) => di.service.rate.exists(id)}
      getBackPath={() => '/admin/rates'}
    />
  );
};
