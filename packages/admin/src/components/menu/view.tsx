/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import { useIntl } from 'react-intl';
import { NavLink, Link } from 'react-router-dom';

import { Menu } from '@eye8/admin-ui';
import { LanguageDropdown } from '@eye8/client/components';
import { PopoverTriggerClickProps } from '@eye8/shared/components';
import { isUserSetAsAdmin } from '@eye8/shared/helpers';
import { mediaQueries } from '@eye8/shared/styles';

import { ViewProps as Props } from './presenter';

const LanguageDrodownTrigger = React.forwardRef<any, PopoverTriggerClickProps>((props, ref) => {
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

const AdminMenuView = ({ onLogOutClick, user }: Props) => {
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

export default AdminMenuView;
