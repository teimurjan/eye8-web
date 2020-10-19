import * as React from 'react';

import { DeleteModalContainer } from 'src/components/admin/table/DeleteModal/DeleteModalContainer';
import { useDependencies } from 'src/DI/DI';
import { useAdminBannersState } from 'src/state/Admin/AdminBannersState';

export const AdminBannersDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    state: { remove: deleteBanner },
  } = useAdminBannersState();

  const deleteEntity = React.useCallback(
    async (id: number) => {
      await dependencies.services.banner.delete(id);
      deleteBanner(id);
    },
    [deleteBanner, dependencies.services.banner],
  );

  const preloadData = React.useCallback(
    async ({ id, setError, setIsLoading }) => {
      try {
        setIsLoading(true);
        const isExists = await dependencies.services.banner.exists(id);
        if (!isExists) {
          setError('AdminCategories.notFound');
        }
      } catch (e) {
        setError('errors.common');
      } finally {
        setIsLoading(false);
      }
    },
    [dependencies.services.banner],
  );

  return (
    <DeleteModalContainer deleteEntity={deleteEntity} preloadData={preloadData} getBackPath={() => '/admin/banners'} />
  );
};
