/** @jsx jsx */
import { jsx } from '@emotion/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { Anchor } from 'src/components/client-ui/Anchor/Anchor';
import { Popover, TriggerHoverProps as PopoverTriggerProps } from 'src/components/client-ui/Popover/Popover';
import { WithIcon } from 'src/components/client-ui/WithIcon/WithIcon';
import { useHeaderIconSize } from 'src/components/Client/Header/HeaderView';
import { IViewProps as IProps } from 'src/components/Client/UserDropdown/UserDropdownPresenter';
import { isUserAuthorized, isUserAdminOrManager } from 'src/helpers/user';

const Trigger = React.forwardRef<HTMLAnchorElement, PopoverTriggerProps>((props, ref) => {
  const intl = useIntl();
  const size = useHeaderIconSize();
  return (
    <Anchor ref={ref} weight={Anchor.Weight.Bold} noHoverOnTouch {...props}>
      <WithIcon icon={faUser} size={size} hideTextOnMobile>
        {intl.formatMessage({ id: 'common.account' })}
      </WithIcon>
    </Anchor>
  );
});

export const UserDropdownView = ({ user, onLogoutClick, openAuthModal }: IProps) => {
  const intl = useIntl();

  const items = [];

  if (isUserAdminOrManager(user)) {
    items.push(
      <Anchor key="adminPanel" href="/admin" weight={Anchor.Weight.Thin}>
        {intl.formatMessage({ id: 'Header.admin' })}
      </Anchor>,
    );
  }

  if (!isUserAuthorized(user)) {
    items.push(
      <Anchor key="logIn" onClick={() => openAuthModal('login')} shallow weight={Anchor.Weight.Thin}>
        {intl.formatMessage({ id: 'Header.logIn' })}
      </Anchor>,
      <Anchor key="signUp" onClick={() => openAuthModal('signup')} shallow weight={Anchor.Weight.Thin}>
        {intl.formatMessage({ id: 'Header.signUp' })}
      </Anchor>,
    );
  } else {
    items.push(
      <Anchor key="orders" href="/profile" as="/profile/orders" weight={Anchor.Weight.Thin}>
        {intl.formatMessage({ id: 'Header.orders' })}
      </Anchor>,
      <Anchor key="logOut" onClick={onLogoutClick} weight={Anchor.Weight.Thin}>
        {intl.formatMessage({ id: 'Header.logOut' })}
      </Anchor>,
    );
  }

  return (
    <Popover TriggerComponent={Trigger} openOnHover closeOnClick>
      <Popover.Content>{items}</Popover.Content>
    </Popover>
  );
};
