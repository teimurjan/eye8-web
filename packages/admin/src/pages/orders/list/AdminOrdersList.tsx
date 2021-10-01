import { Table, Space, TableProps } from 'antd';
import React, { useCallback } from 'react';
import { Trash as TrashIcon, Edit2 as Edit2Icon } from 'react-feather';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { Order } from '@eye8/api';
import { IconSize } from '@eye8/shared/styles';
import { buildSearchString } from '@eye8/shared/utils';

import { useAdminOrdersFilters } from '../../../hooks';
import { useAdminOrdersState } from '../../../state';

const AdminOrdersList = () => {
  const intl = useIntl();
  const {
    filters: { deleted },
    setFilters,
  } = useAdminOrdersFilters();
  const { isListLoading, entities, get } = useAdminOrdersState();

  React.useEffect(() => {
    get({ deleted });
  }, [get, deleted]);

  const onTableChange: TableProps<Order>['onChange'] = useCallback(
    (_, filters) => {
      setFilters({ deleted: filters.is_deleted?.[0] });
    },
    [setFilters],
  );

  return (
    <>
      <Table<Order>
        locale={{ emptyText: intl.formatMessage({ id: 'AdminOrders.notFound.title' }) }}
        loading={isListLoading}
        dataSource={entities}
        pagination={false}
        onChange={onTableChange}
      >
        <Table.Column<Order> key="id" dataIndex="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <Table.Column<Order>
          key="user_name"
          dataIndex="user_name"
          title={intl.formatMessage({ id: 'AdminOrders.userName' })}
        />
        <Table.Column<Order>
          key="user_phone_number"
          dataIndex="user_phone_number"
          title={intl.formatMessage({ id: 'AdminOrders.userPhoneNumber' })}
        />
        <Table.Column<Order>
          key="user_address"
          dataIndex="user_address"
          title={intl.formatMessage({ id: 'AdminOrders.userAddress' })}
        />
        <Table.Column<Order> key="status" dataIndex="status" title={intl.formatMessage({ id: 'AdminOrders.status' })} />
        <Table.Column<Order>
          key="created_on"
          dataIndex="created_on"
          title={intl.formatMessage({ id: 'AdminOrders.createdOn' })}
        />
        <Table.Column<Order>
          key="is_deleted"
          dataIndex="is_deleted"
          title={intl.formatMessage({ id: 'common.deleted' })}
          filteredValue={[deleted]}
          filters={[
            {
              text: intl.formatMessage({ id: 'common.showDeleted' }),
              value: true,
            },
          ]}
          render={(value) => (value ? '✅' : '❌')}
        />
        <Table.Column<Order>
          title={intl.formatMessage({ id: 'common.actions' })}
          key="actions"
          render={(_, record) => (
            <Space size="middle">
              <Link to={`/admin/orders/edit/${record.id}`}>
                <Edit2Icon size={IconSize.Medium} />
              </Link>
              <Link to={`/admin/orders/delete/${record.id}${buildSearchString({ deleted })}`}>
                <TrashIcon size={IconSize.Medium} />
              </Link>
            </Space>
          )}
        />
      </Table>
    </>
  );
};

export default AdminOrdersList;
