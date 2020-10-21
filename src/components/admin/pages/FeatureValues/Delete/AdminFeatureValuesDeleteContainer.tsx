import * as React from 'react';

import { DeleteModalContainer } from 'src/components/admin/table/DeleteModal/DeleteModalContainer';
import { useDependencies } from 'src/DI/DI';
import { useAdminFeatureValuesState } from 'src/state/Admin/AdminFeatureValuesState';

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
