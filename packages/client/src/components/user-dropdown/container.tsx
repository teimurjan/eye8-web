import React from 'react';

import { useAuthModalState } from '@eye8/client/state';
import { useUserState } from '@eye8/shared/state';

import UserDropdownPresenter from './presenter';
import UserDropdownView from './view';

const UserDropdownContainer = () => {
  const userState = useUserState();

  const authModalState = useAuthModalState();

  return <UserDropdownPresenter View={UserDropdownView} userState={userState} authModalState={authModalState} />;
};

export default UserDropdownContainer;
