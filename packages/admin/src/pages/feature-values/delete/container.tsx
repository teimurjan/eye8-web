import React from 'react';

import { DeleteModalContainer } from '@eye8/admin/components/delete-modal/container';
import { useAdminFeatureValuesState } from '@eye8/admin/state/feature-values';
import { useDependencies } from '@eye8/di';

export const AdminFeatureValuesDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    state: { remove: deleteFeatureValue },
  } = useAdminFeatureValuesState();

  return (
    <DeleteModalContainer
      deleteEntity={async ({ id }) => {
        await dependencies.services.featureValue.delete(id);
        deleteFeatureValue(id);
      }}
      checkExistence={({ id }) => dependencies.services.featureValue.exists(id)}
      getBackPath={() => '/admin/featureValues'}
    />
  );
};
