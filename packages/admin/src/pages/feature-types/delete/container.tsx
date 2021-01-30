import React from 'react';

import { useDI } from '@eye8/di';

import { DeleteModal } from '../../../components';
import { useAdminFeatureTypesState } from '../../../state';

export const AdminFeatureTypesDeleteContainer = () => {
  const { di } = useDI();
  const { remove: deleteFeatureType } = useAdminFeatureTypesState();

  return (
    <DeleteModal
      deleteEntity={async ({ id }) => {
        await di.service.featureType.delete(id);
        deleteFeatureType(id);
      }}
      checkExistence={({ id }) => di.service.featureType.exists(id)}
      getBackPath={() => '/admin/featureTypes'}
    />
  );
};
