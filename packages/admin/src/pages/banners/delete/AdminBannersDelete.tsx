import React from 'react';

import { useAdminBannersState } from '@eye8/admin/state';
import { useDI } from '@eye8/di';

import { DeleteModal } from '../../../components';

const AdminBannersDelete = () => {
  const { di } = useDI();
  const { remove: deleteBanner } = useAdminBannersState();

  return (
    <DeleteModal
      deleteEntity={async ({ id }) => {
        await di.service.banner.delete(id);
        deleteBanner(id);
      }}
      checkExistence={({ id }) => di.service.banner.exists(id)}
      getBackPath={() => '/admin/banners'}
    />
  );
};

export default AdminBannersDelete;
