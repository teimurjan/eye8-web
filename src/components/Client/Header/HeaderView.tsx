/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from 'emotion-theming';
import Link from 'next/link';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { Container } from 'src/components/admin-ui/Container/Container';
import { Anchor } from 'src/components/client-ui/Anchor/Anchor';
import { Drawer } from 'src/components/client-ui/Drawer/Drawer';
import { Menu } from 'src/components/client-ui/Menu/Menu';
import { Navbar } from 'src/components/client-ui/Navbar/Navbar';
import { Popover } from 'src/components/client-ui/Popover/Popover';
import { TriggerHoverProps as PopoverTriggerProps } from 'src/components/client-ui/Popover/Popover';
import { CartContainer } from 'src/components/Client/Cart/CartContainer';
import { NavContainer } from 'src/components/Client/Nav/NavContainer';
import { SearchContainer } from 'src/components/Client/Search/SearchContainer';
import { UserDropdownContainer as UserDropdown } from 'src/components/Client/UserDropdown/UserDropdownContainer';
import { useBoolean } from 'src/hooks/useBoolean';
import { useLazyInitialization } from 'src/hooks/useLazyInitialization';
import { useMedia } from 'src/hooks/useMedia';
import { mediaQueries } from 'src/styles/media';
import { withPublicURL } from 'src/utils/url';

const CategoriesTrigger = React.forwardRef<HTMLAnchorElement, PopoverTriggerProps>((props, ref) => {
  const intl = useIntl();
  return (
    <Anchor ref={ref} {...props}>
      {intl.formatMessage({ id: 'Nav.categories.title' })}
    </Anchor>
  );
});

const DesktopNav = () => {
  const intl = useIntl();
  const theme = useTheme<ClientUITheme>();

  return (
    <>
      <Popover TriggerComponent={CategoriesTrigger} offset={[0, 24]} openOnHover>
        <Popover.Content
          css={css`
            width: 100vw;
            background: ${theme.backgroundSecondaryColor};
            border-bottom: 1px solid ${theme.borderColor};
            box-shadow: none;
          `}
        >
          <Container>
            <NavContainer />
          </Container>
        </Popover.Content>
      </Popover>
      <Anchor href="/how-it-works">{intl.formatMessage({ id: 'HowItWorks.title' })}</Anchor>
    </>
  );
};

const MobileNav = () => {
  const intl = useIntl();
  const theme = useTheme<ClientUITheme>();

  return (
    <Menu
      css={css`
        width: 70vw;
        height: 100%;
        background: ${theme.backgroundSecondaryColor};
      `}
    >
      <Menu.List>
        <Menu.Item>
          <NavContainer />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <Anchor href="/how-it-works" primary>
            {intl.formatMessage({ id: 'HowItWorks.title' })}
          </Anchor>
        </Menu.Item>
      </Menu.List>
    </Menu>
  );
};

export const HeaderView = () => {
  const intl = useIntl();
  const theme = useTheme<ClientUITheme>();

  const isMobile = useMedia([mediaQueries.maxWidth768], [true], false);
  const { value: lazyIsMobile, isInitialized } = useLazyInitialization(isMobile, false);

  const { value: isMobileNavOpen, setPositive: openMobileMenu, setNegative: closeMobileMenu } = useBoolean();

  return (
    <Navbar>
      <Container>
        <div
          css={css`
            display: flex;
            width: 100%;
          `}
        >
          {lazyIsMobile && isInitialized && (
            <>
              <span
                onClick={openMobileMenu}
                css={css`
                  padding: 20px 10px;
                  margin-left: -10px;
                  align-self: center;
                `}
              >
                <FontAwesomeIcon icon={faBars} />
              </span>
              <Drawer
                css={css`
                  & ~ span > .fa-times {
                    color: ${theme.textBrightColor};
                  }
                `}
                isOpen={isMobileNavOpen}
                fromSide="left"
                close={closeMobileMenu}
                onClick={closeMobileMenu}
                backdrop
                fixed
              >
                <MobileNav />
              </Drawer>
            </>
          )}
          <Link href="/">
            <a
              css={css`
                background: transparent !important;
              `}
              href="/"
              className="navbar-item"
            >
              <img
                alt={intl.formatMessage({ id: 'common.logo' })}
                css={css`
                  max-height: 3.5rem !important;

                  @media ${mediaQueries.maxWidth768} {
                    max-height: 2.5rem !important;
                    padding-top: 0;
                  }
                `}
                src={withPublicURL('icons/images/icons/icon-192x192.png')}
              />
            </a>
          </Link>
          <Navbar.Section
            css={css`
              margin-left: 10px;
            `}
          >
            {!lazyIsMobile && isInitialized && <DesktopNav />}
          </Navbar.Section>
          <Navbar.Section
            css={css`
              margin-left: auto;
            `}
          >
            <SearchContainer />
            <UserDropdown />
            <CartContainer />
          </Navbar.Section>
        </div>
      </Container>
    </Navbar>
  );
};
