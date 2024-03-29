import React from 'react';
import { useIntl } from 'react-intl';

import { AuthModalState } from '@eye8/client/state';
import { useToast, ToastId } from '@eye8/shared/context/toast';
import { User, UserState } from '@eye8/shared/state';

interface Props {
  View: React.ComponentType<ViewProps>;
  authModalState: AuthModalState;
  userState: UserState;
}

export interface ViewProps {
  user: User;
  onLogoutClick: () => void;
  openAuthModal: AuthModalState['open'];
}

const UserDropdownPresenter = ({
  View,
  userState: { clearUser, user },
  authModalState: { open: openAuthModal },
}: Props) => {
  const intl = useIntl();
  const toast = useToast();

  const onLogOutClick = React.useCallback(() => {
    clearUser();
    toast({
      id: ToastId.LogoutSuccessful,
      children: intl.formatMessage({ id: 'Logout.success' }),
      type: 'primary',
      duration: 5000,
    });
  }, [clearUser, intl, toast]);

  return <View onLogoutClick={onLogOutClick} user={user} openAuthModal={openAuthModal} />;
};

export default UserDropdownPresenter;
