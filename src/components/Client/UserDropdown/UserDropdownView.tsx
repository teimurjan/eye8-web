/** @jsx jsx */
import { jsx } from '@emotion/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { Anchor } from 'src/components/client-ui/Anchor/Anchor';
import { Popover, TriggerHoverProps as PopoverTriggerProps } from 'src/components/client-ui/Popover/Popover';
import { WithIcon } from 'src/components/client-ui/WithIcon/WithIcon';
import { LanguageDropdownContainer as LanguageDropdown } from 'src/components/Client/LanguageDropdown/LanguageDropdownContainer';
import { IViewProps as IProps } from 'src/components/Client/UserDropdown/UserDropdownPresenter';
import { isUserAuthorized, isUserAdminOrManager } from 'src/helpers/user';

const Trigger = React.forwardRef<HTMLAnchorElement, PopoverTriggerProps>((props, ref) => {
  const intl = useIntl();
  return (
    <Anchor ref={ref} noHoverOnTouch {...props}>
      <WithIcon icon={faUser} hideTextOnMobile>
        {intl.formatMessage({ id: 'common.account' })}
      </WithIcon>
    </Anchor>
  );
});

export const UserDropdownView = ({ user, onLogoutClick, openAuthModal }: IProps) => {
  const intl = useIntl();
  const languageDropdownRef = React.useRef<HTMLDivElement>(null);

  const items = [];

  if (isUserAdminOrManager(user)) {
    items.push(
      <Anchor key="adminPanel" href="/admin" thin>
        {intl.formatMessage({ id: 'Header.admin' })}
      </Anchor>,
    );
  }

  if (!isUserAuthorized(user)) {
    items.push(
      <Anchor key="logIn" onClick={() => openAuthModal('login')} shallow thin>
        {intl.formatMessage({ id: 'Header.logIn' })}
      </Anchor>,
      <Anchor key="signUp" onClick={() => openAuthModal('signup')} shallow thin>
        {intl.formatMessage({ id: 'Header.signUp' })}
      </Anchor>,
    );
  } else {
    items.push(
      <Anchor key="orders" href="/profile/orders" thin>
        {intl.formatMessage({ id: 'Header.orders' })}
      </Anchor>,
      <Anchor key="logOut" onClick={onLogoutClick} thin>
        {intl.formatMessage({ id: 'Header.logOut' })}
      </Anchor>,
    );
  }

  items.push(
    <Anchor key="language" thin>
      <LanguageDropdown ref={languageDropdownRef} openOnHover placement="bottom-start" offset={[-20, 10]} />
    </Anchor>,
  );

  return (
    <Popover refsToInclude={[languageDropdownRef]} TriggerComponent={Trigger} openOnHover closeOnClick>
      <Popover.Content>{items}</Popover.Content>
    </Popover>
  );
};
