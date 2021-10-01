import React from 'react';
import { useLocation } from 'react-router';

import { useUserState } from '@eye8/shared/state';

import AdminMenuPresenter from './presenter';
import AdminMenuView from './view';

const AdminMenuContainer = () => {
  const userState = useUserState();

  const location = useLocation();

  return <AdminMenuPresenter View={AdminMenuView} location={location} userState={userState} />;
};

export default AdminMenuContainer;
