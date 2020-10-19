/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { NavLink, Link } from 'react-router-dom';

import { Menu } from 'src/components/admin-ui/Menu/Menu';
import { IViewProps as IProps } from 'src/components/admin/menu/AdminMenuPresenter';
import { TriggerClickProps as PopoverTriggerProps } from 'src/components/client-ui/Popover/Popover';
import { LanguageDropdownContainer as LanguageDropdown } from 'src/components/client/LanguageDropdown/LanguageDropdownContainer';
import { isUserSetAsAdmin } from 'src/helpers/user';
import { mediaQueries } from 'src/styles/media';

const LanguageDrodownTrigger = React.forwardRef<any, PopoverTriggerProps>((props, ref) => {
  const intl = useIntl();

  const modifiedOnClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      if (props.onClick) {
        props.onClick(e);
      }
    },
    [props],
  );

  return (
    <Link
      ref={ref}
      css={css`
        width: 100%;
      `}
      to="#"
      onClick={modifiedOnClick}
    >
      {intl.formatMessage({ id: 'AdminMenu.changeLangaugeLinkText' })}
    </Link>
  );
});

export const AdminMenuView = ({ onLogOutClick, user }: IProps) => {
  const intl = useIntl();

  return (
    <Menu
      css={css`
        width: 100%;
        height: 100vh;
        padding: 3rem 1.5rem;

        @media ${mediaQueries.maxWidth768} {
          height: auto;
        }
      `}
    >
      <Menu.List>
        <Menu.Item>
          <a href="/">{intl.formatMessage({ id: 'AdminMenu.client' })}</a>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/admin" exact activeClassName="is-active">
            {intl.formatMessage({ id: 'AdminMenu.home' })}
          </NavLink>
        </Menu.Item>
      </Menu.List>
      <Menu.Label>{intl.formatMessage({ id: 'AdminMenu.modelsLabel' })}</Menu.Label>
      <Menu.List>
        <Menu.Item>
          <NavLink to="/admin/categories" activeClassName="is-active">
            {intl.formatMessage({ id: 'AdminMenu.categoriesLinkText' })}
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/admin/characteristics" activeClassName="is-active">
            {intl.formatMessage({ id: 'AdminMenu.characteristicsLinkText' })}
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/admin/characteristicValues" activeClassName="is-active">
            {intl.formatMessage({ id: 'AdminMenu.characteristicValuesLinkText' })}
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/admin/featureTypes" activeClassName="is-active">
            {intl.formatMessage({ id: 'AdminMenu.featureTypesLinkText' })}
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/admin/featureValues" activeClassName="is-active">
            {intl.formatMessage({ id: 'AdminMenu.featureValuesLinkText' })}
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/admin/productTypes" activeClassName="is-active">
            {intl.formatMessage({ id: 'AdminMenu.productTypesLinkText' })}
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/admin/products" activeClassName="is-active">
            {intl.formatMessage({ id: 'AdminMenu.productsLinkText' })}
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/admin/banners" activeClassName="is-active">
            {intl.formatMessage({ id: 'AdminMenu.bannersLinkText' })}
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/admin/orders" activeClassName="is-active">
            {intl.formatMessage({ id: 'AdminMenu.ordersLinkText' })}
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/admin/promoCodes" activeClassName="is-active">
            {intl.formatMessage({ id: 'AdminMenu.promoCodesLinkText' })}
          </NavLink>
        </Menu.Item>
        {isUserSetAsAdmin(user) && (
          <Menu.Item>
            <NavLink to="/admin/rates" activeClassName="is-active">
              {intl.formatMessage({ id: 'AdminMenu.ratesLinkText' })}
            </NavLink>
          </Menu.Item>
        )}
      </Menu.List>

      <Menu.Label>{intl.formatMessage({ id: 'AdminMenu.actionsLabel' })}</Menu.Label>
      <Menu.List>
        <Menu.Item>
          <LanguageDropdown
            css={css`
              width: 100%;
            `}
            TriggerComponent={LanguageDrodownTrigger}
          />
        </Menu.Item>
        <Menu.Item>
          <Link to="#" onClick={onLogOutClick}>
            {intl.formatMessage({ id: 'AdminMenu.logoutLinkText' })}
          </Link>
        </Menu.Item>
      </Menu.List>
    </Menu>
  );
};
