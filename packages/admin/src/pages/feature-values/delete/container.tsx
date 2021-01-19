import React from 'react';

import { DeleteModalContainer } from '@eye8/admin/components/delete-modal/container';
import { useAdminFeatureValuesState } from '@eye8/admin/state/feature-values';
import { useDI } from '@eye8/di';

export const AdminFeatureValuesDeleteContainer = () => {
  const { di } = useDI();
  const {
    state: { remove: deleteFeatureValue },
  } = useAdminFeatureValuesState();

  return (
    <DeleteModalContainer
      deleteEntity={async ({ id }) => {
        await di.service.featureValue.delete(id);
        deleteFeatureValue(id);
      }}
      checkExistence={({ id }) => di.service.featureValue.exists(id)}
      getBackPath={() => '/admin/featureValues'}
    />
  );
};
