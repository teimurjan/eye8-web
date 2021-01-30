import React from 'react';

import { useDI } from '@eye8/di';

import { DeleteModal } from '../../../components';
import { useAdminFeatureValuesState } from '../../../state';

export const AdminFeatureValuesDeleteContainer = () => {
  const { di } = useDI();
  const { remove: deleteFeatureValue } = useAdminFeatureValuesState();

  return (
    <DeleteModal
      deleteEntity={async ({ id }) => {
        await di.service.featureValue.delete(id);
        deleteFeatureValue(id);
      }}
      checkExistence={({ id }) => di.service.featureValue.exists(id)}
      getBackPath={() => '/admin/featureValues'}
    />
  );
};
