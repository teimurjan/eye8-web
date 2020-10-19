import * as React from 'react';

import { AdminMenuPresenter } from 'src/components/admin/menu/AdminMenuPresenter';
import { AdminMenuView } from 'src/components/admin/menu/AdminMenuView';
import { useUserState } from 'src/state/UserState';

export const AdminMenuContainer = () => {
  const { userState } = useUserState();

  return <AdminMenuPresenter View={AdminMenuView} userState={userState} />;
};
