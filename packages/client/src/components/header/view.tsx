import { css, useTheme } from '@emotion/react';
import Link from 'next/link';
import React from 'react';
import { Zap as ZapIcon, Menu as MenuIcon, Globe as GlobeIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { Container, Anchor, Menu, Navbar } from '@eye8/client-ui';
import { LogoSVG } from '@eye8/client/svg';
import { IconWrapper, Popover, PopoverTriggerHoverProps, Drawer } from '@eye8/shared/components';
import { isUserAdminOrManager } from '@eye8/shared/helpers';
import { useLazyInitialization, useMedia, useBoolean } from '@eye8/shared/hooks';
import { IconSize, mediaQueries } from '@eye8/shared/styles';
import { shouldUseThemeToggle } from '@eye8/shared/utils';

import Cart from '../cart';
import LanguageDropdown from '../language-dropdown';
import Nav, { navItemCSS } from '../nav';
import Search from '../search';
import ThemeToggle from '../theme-toggle';
import UserDropdown from '../user-dropdown';

import { ViewProps as Props } from './presenter';

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
  const theme = useTheme() as ClientUITheme;

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
            <Nav />
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
  const theme = useTheme() as ClientUITheme;

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
          <Nav />
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
    const theme = useTheme() as ClientUITheme;

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
  const theme = useTheme() as ClientUITheme;

  return (
    <div
      css={css`
        border-bottom: 1px solid ${theme.borderLightGrayColor};
      `}
    >
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
          <LanguageDropdown
            openOnHover
            placement="bottom-end"
            offset={[0, 0]}
            TriggerComponent={LanguagePreHeaderItem}
          />
        </div>
      </Container>
    </div>
  );
};

const HeaderView = ({ user }: Props) => {
  const theme = useTheme() as ClientUITheme;

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
                  max-height: 60px !important;
                  margin-top: 7.5px;

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
              <Search />
              <UserDropdown />
              <Cart />
            </Navbar.Section>
          </div>
        </Container>
      </div>
    </Navbar>
  );
};

export default HeaderView;
