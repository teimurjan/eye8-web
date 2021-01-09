/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import Link from 'next/link';
import React from 'react';
import { Zap as ZapIcon, Menu as MenuIcon, Globe as GlobeIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { Container, Anchor, Divider, Menu, Navbar } from '@eye8/client-ui';
import { CartContainer } from '@eye8/client/components/cart/container';
import { ViewProps as Props } from '@eye8/client/components/header/presenter';
import { LanguageDropdownContainer as LanguageDropdown } from '@eye8/client/components/language-dropdown/container';
import { NavContainer } from '@eye8/client/components/nav/container';
import { navItemCSS } from '@eye8/client/components/nav/view';
import { SearchContainer } from '@eye8/client/components/search/container';
import { ThemeToggleContainer as ThemeToggle } from '@eye8/client/components/theme-toggle/container';
import { UserDropdownContainer as UserDropdown } from '@eye8/client/components/user-dropdown/container';
import LogoSVG from '@eye8/client/svg/logo.svg';
import { IconWrapper, Popover, PopoverTriggerHoverProps, Drawer } from '@eye8/shared/components';
import { isUserAdminOrManager } from '@eye8/shared/helpers';
import { useLazyInitialization, useMedia, useBoolean } from '@eye8/shared/hooks';
import { IconSize, mediaQueries } from '@eye8/shared/styles';
import { shouldUseThemeToggle } from '@eye8/shared/utils';

const CategoriesTrigger = React.forwardRef<HTMLAnchorElement, PopoverTriggerHoverProps>((props, ref) => {
  const intl = useIntl();
  return (
    <Anchor ref={ref} weight={Anchor.Weight.Bold} {...props}>
      {intl.formatMessage({ id: 'Nav.categories.title' })}
    </Anchor>
  );
});

const DesktopNav = () => {
  const intl = useIntl();
  const theme = useTheme<ClientUITheme>();

  return (
    <>
      <Popover TriggerComponent={CategoriesTrigger} offset={[0, 16]} boxShadow={Popover.BoxShadow.Bottom} openOnHover>
        <Popover.Content
          css={css`
            width: 100vw;
            border-top: 1px solid ${theme.borderLightGrayColor};
          `}
        >
          <Container>
            <NavContainer />
          </Container>
        </Popover.Content>
      </Popover>
      <Anchor href="/how-it-works" weight={Anchor.Weight.Bold}>
        {intl.formatMessage({ id: 'HowItWorks.title' })}
      </Anchor>
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
          <Anchor
            css={css`
              ${navItemCSS};
            `}
            href="/how-it-works"
            weight={Anchor.Weight.Bold}
          >
            {intl.formatMessage({ id: 'HowItWorks.title' })}
          </Anchor>
        </Menu.Item>
      </Menu.List>
    </Menu>
  );
};

interface PreHeaderItemProps extends PopoverTriggerHoverProps {
  children: React.ReactNode;
  className?: string;
}

const PreHeaderItem = React.forwardRef<HTMLDivElement, PreHeaderItemProps>(
  ({ children, className, onClick, onMouseEnter }, ref) => {
    const theme = useTheme<ClientUITheme>();

    return (
      <div
        css={css`
          display: flex;
          align-items: center;
          cursor: pointer;
          color: ${theme.textSecondaryColor};
          font-size: 14px;

          &:hover {
            color: ${theme.textColor};
          }
        `}
        ref={ref}
        className={className}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        {children}
      </div>
    );
  },
);

const LanguagePreHeaderItem = React.forwardRef<HTMLDivElement, PopoverTriggerHoverProps>((props, ref) => {
  const intl = useIntl();

  return (
    <PreHeaderItem ref={ref} {...props}>
      {intl.formatMessage({ id: 'AdminMenu.changeLangaugeLinkText' })}
      <IconWrapper
        css={css`
          margin-left: 7.5px;
          line-height: 1;
        `}
      >
        <GlobeIcon size={IconSize.Small} />
      </IconWrapper>
    </PreHeaderItem>
  );
});

interface PreHeaderProps {
  user: Props['user'];
}

const PreHeader = ({ user }: PreHeaderProps) => {
  const intl = useIntl();

  return (
    <Container>
      <div
        css={css`
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 5px 0;
        `}
      >
        <PreHeaderItem
          css={css`
            margin-right: auto;
          `}
        >
          {shouldUseThemeToggle() && <ThemeToggle />}
        </PreHeaderItem>
        {isUserAdminOrManager(user) && (
          <Link href="/admin">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              css={css`
                display: flex;
              `}
            >
              <PreHeaderItem
                css={css`
                  margin-right: 15px;
                `}
              >
                {intl.formatMessage({ id: 'Header.admin' })}
                <IconWrapper
                  css={css`
                    margin-left: 5px;
                  `}
                >
                  <ZapIcon size={IconSize.Small} />
                </IconWrapper>
              </PreHeaderItem>
            </a>
          </Link>
        )}
        <LanguageDropdown openOnHover placement="bottom-end" offset={[0, 0]} TriggerComponent={LanguagePreHeaderItem} />
      </div>
    </Container>
  );
};

export const HeaderView = ({ user }: Props) => {
  const theme = useTheme<ClientUITheme>();

  const isMobile = useMedia([mediaQueries.maxWidth768], [true], false);
  const { value: lazyIsMobile, isInitialized } = useLazyInitialization(isMobile, false);

  const { value: isMobileNavOpen, setPositive: openMobileMenu, setNegative: closeMobileMenu } = useBoolean();

  return (
    <Navbar>
      <div
        css={css`
          flex: 1;
        `}
      >
        <PreHeader user={user} />
        <Divider
          css={css`
            margin: 0;
          `}
          color={Divider.Color.lightGray}
        />
        <Container>
          <div
            css={css`
              display: flex;
            `}
          >
            {lazyIsMobile && isInitialized && (
              <>
                <IconWrapper
                  onClick={openMobileMenu}
                  css={css`
                    padding: 20px 10px;
                    margin-left: -10px;
                    align-self: center;
                  `}
                >
                  <MenuIcon size={IconSize.Medium} />
                </IconWrapper>
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
                  display: inline-block;
                  max-width: 80px;
                  max-height: 70px !important;

                  @media ${mediaQueries.maxWidth768} {
                    max-height: 55px !important;
                    margin-top: 7.5px;
                    padding-top: 0 !important;
                  }
                `}
                href="/"
                className="navbar-item"
              >
                <LogoSVG
                  css={css`
                    max-width: 100%;
                    height: 100%;
                    display: block;
                    fill: ${theme.textColor};
                  `}
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
      </div>
    </Navbar>
  );
};
