/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { NoDataAvailable, Section } from '@eye8/admin-ui';
import { ViewProps as Props } from '@eye8/admin/pages/orders/list/presenter';

import { Table } from '../../../components';

const NoOrdersAvialable = () => {
  const intl = useIntl();
  return <NoDataAvailable title={intl.formatMessage({ id: 'AdminOrders.notFound.title' })} />;
};

const renderNoData = () => <NoOrdersAvialable />;

type Order = Props['orders'][0];

export const AdminOrdersListView = ({ orders, isLoading, isDataLoaded }: Props) => {
  const intl = useIntl();
  return (
    <Section
      css={css`
        width: 100%;
      `}
    >
      <Table<Order>
        hideSubheader={true}
        pathPrefix="/admin/orders"
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        entities={orders}
        renderNoData={renderNoData}
      >
        <Table.Col<Order> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <Table.Col<Order> key_="user_name" title={intl.formatMessage({ id: 'AdminOrders.userName' })} />
        <Table.Col<Order>
          key_="user_phone_number"
          title={intl.formatMessage({ id: 'AdminOrders.userPhoneNumber' })}
        />
        <Table.Col<Order> key_="user_address" title={intl.formatMessage({ id: 'AdminOrders.userAddress' })} />
        <Table.Col<Order> key_="status" title={intl.formatMessage({ id: 'AdminOrders.status' })} />
        <Table.Col<Order> key_="created_on" title={intl.formatMessage({ id: 'AdminOrders.createdOn' })} />
      </Table>
    </Section>
  );
};
