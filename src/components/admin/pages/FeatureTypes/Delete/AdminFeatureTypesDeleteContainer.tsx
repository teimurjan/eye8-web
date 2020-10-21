import * as React from 'react';

import { DeleteModalContainer } from 'src/components/admin/table/DeleteModal/DeleteModalContainer';
import { useDependencies } from 'src/DI/DI';
import { useAdminFeatureTypesState } from 'src/state/Admin/AdminFeatureTypesState';

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
