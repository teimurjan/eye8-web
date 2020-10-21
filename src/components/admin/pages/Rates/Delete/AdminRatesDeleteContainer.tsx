import * as React from 'react';

import { DeleteModalContainer } from 'src/components/admin/table/DeleteModal/DeleteModalContainer';
import { useDependencies } from 'src/DI/DI';
import * as rateService from 'src/services/RateService';
import { useAdminRatesState } from 'src/state/Admin/AdminRatesState';

const getErrorMessageID = (e: Error) => {
  if (e instanceof rateService.errors.RateHasOrders) {
    return 'AdminRates.errors.hasOrders';
  }

  return 'errors.common';
};

export const AdminRatesDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    state: { remove: deleteRate },
  } = useAdminRatesState();

  return (
    <DeleteModalContainer
      getErrorMessageID={getErrorMessageID}
      deleteEntity={async ({ id, deleted }) => {
        await dependencies.services.rate.delete(id);
        deleteRate(id);
      }}
      checkExistence={({ id, deleted }) => dependencies.services.rate.exists(id)}
      getBackPath={() => '/admin/rates'}
    />
  );
};
