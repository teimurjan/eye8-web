import React from 'react';
import { useIntl } from 'react-intl';

import { IContextValue as AuthModalStateContextValue } from '@eye8/client/state/auth-modal';
import { toast, ToastId } from '@eye8/shared/components/toaster';
import { User, IContextValue as UserStateContextValue } from '@eye8/shared/state/user';

interface IProps extends UserStateContextValue, AuthModalStateContextValue {
  View: React.ComponentType<IViewProps>;
}

export interface IViewProps {
  user: User;
  onLogoutClick: () => void;
  openAuthModal: AuthModalStateContextValue['authModalState']['open'];
}

export const UserDropdownPresenter = ({
  View,
  userState: { clearUser, user },
  authModalState: { open: openAuthModal },
}: IProps) => {
  const intl = useIntl();

  const onLogOutClick = React.useCallback(() => {
    clearUser();
    toast({
      id: ToastId.LogoutSuccessful,
      children: intl.formatMessage({ id: 'Logout.success' }),
      type: 'primary',
      duration: 5000,
    });
  }, [clearUser, intl]);

  return <View onLogoutClick={onLogOutClick} user={user} openAuthModal={openAuthModal} />;
};
