/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
import { User as UserIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { Anchor } from 'src/components/client-ui/Anchor/Anchor';
import { Popover, TriggerHoverProps as PopoverTriggerProps } from 'src/components/client-ui/Popover/Popover';
import { WithIcon } from 'src/components/client-ui/WithIcon/WithIcon';
import { IViewProps as IProps } from 'src/components/Client/UserDropdown/UserDropdownPresenter';
import { isUserAuthorized } from 'src/helpers/user';
import { IconSizes } from 'src/styles/icon';

const Trigger = React.forwardRef<HTMLAnchorElement, PopoverTriggerProps>((props, ref) => {
  const intl = useIntl();
  return (
    <Anchor ref={ref} weight={Anchor.Weight.Bold} noHoverOnTouch {...props}>
      <WithIcon icon={<UserIcon size={IconSizes.Medium} />} hideTextOnMobile>
        {intl.formatMessage({ id: 'common.account' })}
      </WithIcon>
    </Anchor>
  );
});

export const UserDropdownView = ({ user, onLogoutClick, openAuthModal }: IProps) => {
  const intl = useIntl();

  const items = [];

  if (!isUserAuthorized(user)) {
    items.push(
      <Anchor key="logIn" onClick={() => openAuthModal('login')} shallow flex>
        {intl.formatMessage({ id: 'Header.logIn' })}
      </Anchor>,
      <Anchor key="signUp" onClick={() => openAuthModal('signup')} shallow flex>
        {intl.formatMessage({ id: 'Header.signUp' })}
      </Anchor>,
    );
  } else {
    items.push(
      <Anchor key="orders" href="/profile" as="/profile/orders" flex>
        {intl.formatMessage({ id: 'Header.orders' })}
      </Anchor>,
      <Anchor key="logOut" onClick={onLogoutClick} flex>
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
