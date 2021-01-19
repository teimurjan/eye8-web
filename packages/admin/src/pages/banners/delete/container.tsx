import React from 'react';

import { DeleteModalContainer } from '@eye8/admin/components/delete-modal/container';
import { useAdminBannersState } from '@eye8/admin/state/banners';
import { useDI } from '@eye8/di';

export const AdminBannersDeleteContainer = () => {
  const { di } = useDI();
  const {
    state: { remove: deleteBanner },
  } = useAdminBannersState();

  return (
    <DeleteModalContainer
      deleteEntity={async ({ id }) => {
        await di.service.banner.delete(id);
        deleteBanner(id);
      }}
      checkExistence={({ id }) => di.service.banner.exists(id)}
      getBackPath={() => '/admin/banners'}
    />
  );
};
