import * as React from 'react';

import { DeleteModalContainer } from 'src/components/admin/table/DeleteModal/DeleteModalContainer';
import { useDependencies } from 'src/DI/DI';
import { useAdminFeatureValuesState } from 'src/state/Admin/AdminFeatureValuesState';

export const AdminFeatureValuesDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    state: { remove: deleteFeatureValue },
  } = useAdminFeatureValuesState();

  const deleteEntity = React.useCallback(
    async (id: number) => {
      await dependencies.services.featureValue.delete(id);
      deleteFeatureValue(id);
    },
    [deleteFeatureValue, dependencies.services.featureValue],
  );

  const preloadData = React.useCallback(
    async ({ id, setError, setIsLoading }) => {
      try {
        setIsLoading(true);
        const isExists = await dependencies.services.featureValue.exists(id);
        if (!isExists) {
          setError('AdminFeatureValues.notFound');
        }
      } catch (e) {
        setError('errors.common');
      } finally {
        setIsLoading(false);
      }
    },
    [dependencies.services.featureValue],
  );

  return (
    <DeleteModalContainer
      deleteEntity={deleteEntity}
      preloadData={preloadData}
      getBackPath={() => '/admin/featureValues'}
    />
  );
};
