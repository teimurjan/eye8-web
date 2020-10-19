import * as React from 'react';

import { AdminMenuPresenter } from 'src/components/admin/Menu/AdminMenuPresenter';
import { AdminMenuView } from 'src/components/admin/Menu/AdminMenuView';
import { useUserState } from 'src/state/UserState';

export const AdminMenuContainer = () => {
  const { userState } = useUserState();

  return <AdminMenuPresenter View={AdminMenuView} userState={userState} />;
};
