import React from 'react';

import { AdminMenuPresenter } from '@eye8/admin/components/menu/presenter';
import { AdminMenuView } from '@eye8/admin/components/menu/view';
import { useUserState } from '@eye8/shared/state/user';

export const AdminMenuContainer = () => {
  const { userState } = useUserState();

  return <AdminMenuPresenter View={AdminMenuView} userState={userState} />;
};
