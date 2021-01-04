import React from 'react';

import { DeleteModalContainer } from '@eye8/admin/components/delete-modal/container';
import { useAdminBannersState } from '@eye8/admin/state/banners';
import { useDependencies } from '@eye8/di';

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
