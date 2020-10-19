import * as React from 'react';

import { DeleteModalContainer } from 'src/components/admin/table/DeleteModal/DeleteModalContainer';
import { useDependencies } from 'src/DI/DI';
import { useAdminCharacteristicValuesState } from 'src/state/Admin/AdminCharacteristicValuesState';

export const AdminCharacteristicValuesDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    state: { remove: deleteCharacteristicValue },
  } = useAdminCharacteristicValuesState();

  const deleteEntity = React.useCallback(
    async (id: number) => {
      await dependencies.services.characteristicValue.delete(id);
      deleteCharacteristicValue(id);
    },
    [deleteCharacteristicValue, dependencies.services.characteristicValue],
  );

  const preloadData = React.useCallback(
    async ({ id, setError, setIsLoading }) => {
      try {
        setIsLoading(true);
        const isExists = await dependencies.services.characteristicValue.exists(id);
        if (!isExists) {
          setError('AdminCharacteristicValues.notFound');
        }
      } catch (e) {
        setError('errors.common');
      } finally {
        setIsLoading(false);
      }
    },
    [dependencies.services.characteristicValue],
  );

  return (
    <DeleteModalContainer
      deleteEntity={deleteEntity}
      preloadData={preloadData}
      getBackPath={() => '/admin/characteristicValues'}
    />
  );
};
