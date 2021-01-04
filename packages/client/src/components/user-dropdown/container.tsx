import React from 'react';

import { UserDropdownPresenter } from '@eye8/client/components/user-dropdown/presenter';
import { UserDropdownView } from '@eye8/client/components/user-dropdown/view';
import { useAuthModalState } from '@eye8/client/state/auth-modal';
import { useUserState } from '@eye8/shared/state/user';

export const UserDropdownContainer = () => {
  const { userState } = useUserState();

  const { authModalState } = useAuthModalState();

  return <UserDropdownPresenter View={UserDropdownView} userState={userState} authModalState={authModalState} />;
};
