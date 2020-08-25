/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faSuperpowers } from '@fortawesome/free-brands-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from 'emotion-theming';
import Link from 'next/link';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { Container } from 'src/components/admin-ui/Container/Container';
import { Anchor } from 'src/components/client-ui/Anchor/Anchor';
import { Divider } from 'src/components/client-ui/Divider/Divider';
import { Drawer } from 'src/components/client-ui/Drawer/Drawer';
import { HelpText } from 'src/components/client-ui/HelpText/HelpText';
import { Menu } from 'src/components/client-ui/Menu/Menu';
import { Navbar } from 'src/components/client-ui/Navbar/Navbar';
import { Popover } from 'src/components/client-ui/Popover/Popover';
import { TriggerHoverProps as PopoverTriggerProps } from 'src/components/client-ui/Popover/Popover';
import { CartContainer } from 'src/components/Client/Cart/CartContainer';
import { IViewProps as IProps } from 'src/components/Client/Header/HeaderPresenter';
import { LanguageDropdownContainer as LanguageDropdown } from 'src/components/Client/LanguageDropdown/LanguageDropdownContainer';
import { NavContainer } from 'src/components/Client/Nav/NavContainer';
import { navItemCSS } from 'src/components/Client/Nav/NavView';
import { SearchContainer } from 'src/components/Client/Search/SearchContainer';
import { UserDropdownContainer as UserDropdown } from 'src/components/Client/UserDropdown/UserDropdownContainer';
import { isUserAdminOrManager } from 'src/helpers/user';
import { useBoolean } from 'src/hooks/useBoolean';
import { useLazyInitialization } from 'src/hooks/useLazyInitialization';
import { useMedia } from 'src/hooks/useMedia';
import { User } from 'src/state/UserState';
import { mediaQueries } from 'src/styles/media';
import LogoSVG from 'src/svg/logo.svg';

const CategoriesTrigger = React.forwardRef<HTMLAnchorElement, PopoverTriggerProps>((props, ref) => {
  const intl = useIntl();
  return (
    <Anchor ref={ref} weight={Anchor.Weight.Bold} {...props}>
      {intl.formatMessage({ id: 'Nav.categories.title' })}
    </Anchor>
  );
});

const DEFAULT_HEADER_ICON_SIZE = '1x';
export const useHeaderIconSize = () => {
  const size = useMedia<SizeProp | undefined>([mediaQueries.maxWidth768], ['lg'], DEFAULT_HEADER_ICON_SIZE);
  const { value: lazySize } = useLazyInitialization(size, DEFAULT_HEADER_ICON_SIZE);
  return lazySize;
};

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

interface IPreHeaderItemProps {
  children: React.ReactNode;
  className?: string;
}

const PreHeaderItem = ({ children, className }: IPreHeaderItemProps) => {
  const theme = useTheme<ClientUITheme>();
  return (
    <HelpText
      className={className}
      css={css`
        cursor: pointer;

        &:hover {
          color: ${theme.textColor};
        }
      `}
      color={HelpText.Color.Gray}
    >
      {children}
    </HelpText>
  );
};

interface IPreHeaderProps {
  user: User;
}

const PreHeader = ({ user }: IPreHeaderProps) => {
  const intl = useIntl();

  return (
    <Container>
      <div
        css={css`
          display: flex;
          justify-content: flex-end;
          padding: 5px 0;
        `}
      >
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
                <FontAwesomeIcon
                  css={css`
                    margin-left: 5px;
                  `}
                  icon={faSuperpowers}
                />
              </PreHeaderItem>
            </a>
          </Link>
        )}
        <PreHeaderItem>
          <LanguageDropdown openOnHover placement="bottom-end" offset={[0, 0]} />
        </PreHeaderItem>
      </div>
    </Container>
  );
};

export const HeaderView = ({ user }: IProps) => {
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
                <span
                  onClick={openMobileMenu}
                  css={css`
                    padding: 20px 10px;
                    margin-left: -10px;
                    align-self: center;
                  `}
                >
                  <FontAwesomeIcon icon={faBars} size="lg" color={theme.textColor} />
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
                  display: inline-block;
                  max-width: 80px;
                  max-height: 70px !important;

                  @media ${mediaQueries.maxWidth768} {
                    max-height: 55px !important;
                    margin-top: 10px;
                    padding-top: 0 !important;
                  }
                `}
                href="/"
                className="navbar-item"
              >
                <LogoSVG
                  css={css`
                    width: auto;
                    max-height: 100%;
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
