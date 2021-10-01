
import { css } from '@emotion/react';
import { Menu } from 'antd';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { isUserSetAsAdmin } from '@eye8/shared/helpers';

import { ViewProps as Props } from './presenter';

const AdminMenuView = ({ onLogOutClick, user, pathname }: Props) => {
  const intl = useIntl();

  const renderMenuItem = (path: string, title: string) => (
    <Menu.Item key={path}>
      <Link to={path}>{title}</Link>
    </Menu.Item>
  );

  return (
    <Menu
      mode="inline"
      css={css`
        min-height: 100vh;
        height: 100%;
      `}
      selectedKeys={[pathname]}
      openKeys={['models']}
    >
      {renderMenuItem('/', intl.formatMessage({ id: 'AdminMenu.client' }))}
      <Menu.SubMenu key="models" title={intl.formatMessage({ id: 'AdminMenu.modelsLabel' })}>
        {renderMenuItem('/admin/categories', intl.formatMessage({ id: 'AdminMenu.categoriesLinkText' }))}
        {renderMenuItem('/admin/characteristics', intl.formatMessage({ id: 'AdminMenu.characteristicsLinkText' }))}
        {renderMenuItem(
          '/admin/characteristicValues',
          intl.formatMessage({ id: 'AdminMenu.characteristicValuesLinkText' }),
        )}
        {renderMenuItem('/admin/featureTypes', intl.formatMessage({ id: 'AdminMenu.featureTypesLinkText' }))}
        {renderMenuItem('/admin/featureValues', intl.formatMessage({ id: 'AdminMenu.featureValuesLinkText' }))}
        {renderMenuItem('/admin/productTypes', intl.formatMessage({ id: 'AdminMenu.productTypesLinkText' }))}
        {renderMenuItem('/admin/products', intl.formatMessage({ id: 'AdminMenu.productsLinkText' }))}
        {renderMenuItem('/admin/banners', intl.formatMessage({ id: 'AdminMenu.bannersLinkText' }))}
        {renderMenuItem('/admin/promoCodes', intl.formatMessage({ id: 'AdminMenu.promoCodesLinkText' }))}
        {renderMenuItem('/admin/orders', intl.formatMessage({ id: 'AdminMenu.ordersLinkText' }))}
        {isUserSetAsAdmin(user) &&
          renderMenuItem('/admin/rates', intl.formatMessage({ id: 'AdminMenu.ratesLinkText' }))}
      </Menu.SubMenu>
      <Menu.Item key="logout">
        <Link to="#" onClick={onLogOutClick}>
          {intl.formatMessage({ id: 'AdminMenu.logoutLinkText' })}
        </Link>
      </Menu.Item>
    </Menu>
  );
};

export default AdminMenuView;
