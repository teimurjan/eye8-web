import * as React from 'react';

import { DeleteModalContainer } from 'src/components/admin/table/DeleteModal/DeleteModalContainer';
import { useDependencies } from 'src/DI/DI';
import { useAdminBannersState } from 'src/state/Admin/AdminBannersState';

export const AdminBannersDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    state: { remove: deleteBanner },
  } = useAdminBannersState();

  return (
    <DeleteModalContainer
      deleteEntity={async ({ id }) => {
        await dependencies.services.banner.delete(id);
        deleteBanner(id);
      }}
      checkExistence={({ id }) => dependencies.services.banner.exists(id)}
      getBackPath={() => '/admin/banners'}
    />
  );
};
