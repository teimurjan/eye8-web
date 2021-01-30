import React from 'react';

import { useDI } from '@eye8/di';
import { RateHasOrdersError } from '@eye8/service/rate';

import { DeleteModal } from '../../../components';
import { useAdminRatesState } from '../../../state';

const getErrorMessageID = (e: Error) => {
  if (e instanceof RateHasOrdersError) {
    return 'AdminRates.errors.hasOrders';
  }

  return 'errors.common';
};

export const AdminRatesDeleteContainer = () => {
  const { di } = useDI();
  const { remove: deleteRate } = useAdminRatesState();

  return (
    <DeleteModal
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
