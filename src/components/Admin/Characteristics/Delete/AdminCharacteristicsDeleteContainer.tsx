import * as React from 'react';

import { DeleteModalContainer } from 'src/components/Admin/DeleteModal/DeleteModalContainer';
import { useDependencies } from 'src/DI/DI';
import { useAdminCharacteristicsState } from 'src/state/Admin/AdminCharacteristicsState';

export const AdminCharacteristicsDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    state: { remove: deleteCharacteristic },
  } = useAdminCharacteristicsState();

  const deleteEntity = React.useCallback(
    async (id: number) => {
      await dependencies.services.characteristic.delete(id);
      deleteCharacteristic(id);
    },
    [deleteCharacteristic, dependencies.services.characteristic],
  );

  const preloadData = React.useCallback(
    async ({ id, setError, setIsLoading }) => {
      try {
        setIsLoading(true);
        const isExists = await dependencies.services.characteristic.exists(id);
        if (!isExists) {
          setError('AdminCharacteristics.notFound');
        }
      } catch (e) {
        setError('errors.common');
      } finally {
        setIsLoading(false);
      }
    },
    [dependencies.services.characteristic],
  );

  return (
    <DeleteModalContainer
      deleteEntity={deleteEntity}
      preloadData={preloadData}
      getBackPath={() => '/admin/characteristics'}
    />
  );
};
