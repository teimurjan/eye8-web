import * as React from 'react';

import { UserDropdownPresenter } from 'src/components/Client/UserDropdown/UserDropdownPresenter';
import { UserDropdownView } from 'src/components/Client/UserDropdown/UserDropdownView';
import { useUserState } from 'src/state/UserState';

export const UserDropdownContainer = () => {
  const { userState } = useUserState();
  return <UserDropdownPresenter View={UserDropdownView} userState={userState} />;
};
