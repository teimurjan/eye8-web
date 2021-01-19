import React from 'react';

import { DeleteModalContainer } from '@eye8/admin/components/delete-modal/container';
import { useAdminFeatureTypesState } from '@eye8/admin/state/feature-types';
import { useDI } from '@eye8/di';

export const AdminFeatureTypesDeleteContainer = () => {
  const { di } = useDI();
  const {
    state: { remove: deleteFeatureType },
  } = useAdminFeatureTypesState();

  return (
    <DeleteModalContainer
      deleteEntity={async ({ id }) => {
        await di.service.featureType.delete(id);
        deleteFeatureType(id);
      }}
      checkExistence={({ id }) => di.service.featureType.exists(id)}
      getBackPath={() => '/admin/featureTypes'}
    />
  );
};
