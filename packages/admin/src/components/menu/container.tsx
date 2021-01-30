import React from 'react';

import { useUserState } from '@eye8/shared/state';

import AdminMenuPresenter from './presenter';
import AdminMenuView from './view';

const AdminMenuContainer = () => {
  const userState = useUserState();

  return <AdminMenuPresenter View={AdminMenuView} userState={userState} />;
};

export default AdminMenuContainer;
