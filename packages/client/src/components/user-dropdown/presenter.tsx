import React from 'react';
import { useIntl } from 'react-intl';

import { ContextValue as AuthModalStateContextValue } from '@eye8/client/state/auth-modal';
import { useToast, ToastId } from '@eye8/shared/context/toast';
import { User, ContextValue as UserStateContextValue } from '@eye8/shared/state/user';

interface Props extends UserStateContextValue, AuthModalStateContextValue {
  View: React.ComponentType<ViewProps>;
}

export interface ViewProps {
  user: User;
  onLogoutClick: () => void;
  openAuthModal: AuthModalStateContextValue['authModalState']['open'];
}

export const UserDropdownPresenter = ({
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
