import * as React from 'react';
import { useIntl } from 'react-intl';

import { ToastId } from 'src/components/Toast/ids';
import { toast } from 'src/components/Toast/ToastContainer';
import { IContextValue as AuthModalStateContextValue } from 'src/state/AuthModalState';
import { User, IContextValue as UserStateContextValue } from 'src/state/UserState';

interface IProps extends UserStateContextValue, AuthModalStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
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
