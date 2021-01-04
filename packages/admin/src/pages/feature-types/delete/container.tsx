import React from 'react';

import { DeleteModalContainer } from '@eye8/admin/components/delete-modal/container';
import { useAdminFeatureTypesState } from '@eye8/admin/state/feature-types';
import { useDependencies } from '@eye8/di';

export const AdminFeatureTypesDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    state: { remove: deleteFeatureType },
  } = useAdminFeatureTypesState();

  return (
    <DeleteModalContainer
      deleteEntity={async ({ id }) => {
        await dependencies.services.featureType.delete(id);
        deleteFeatureType(id);
      }}
      checkExistence={({ id }) => dependencies.services.featureType.exists(id)}
      getBackPath={() => '/admin/featureTypes'}
    />
  );
};
