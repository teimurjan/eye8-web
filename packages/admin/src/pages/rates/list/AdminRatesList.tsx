import { Table, Divider } from 'antd';
import React from 'react';
import { Edit2 as Edit2Icon } from 'react-feather';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { Rate } from '@eye8/api';
import { IconSize } from '@eye8/shared/styles';

import { useAdminRatesState } from '../../../state';

const AdminRatesList = () => {
  const intl = useIntl();
  const { isListLoading, entities, get } = useAdminRatesState();

  React.useEffect(() => {
    get();
  }, [get]);

  return (
    <>
      <Table<Rate>
        locale={{ emptyText: intl.formatMessage({ id: 'AdminRates.notFound.title' }) }}
        loading={isListLoading}
        dataSource={entities}
        pagination={false}
      >
        <Table.Column<Rate> key="id" dataIndex="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <Table.Column<Rate> key="value" dataIndex="value" title={intl.formatMessage({ id: 'AdminRates.value' })} />
        <Table.Column<Rate> key="name" dataIndex="name" title={intl.formatMessage({ id: 'AdminRates.name' })} />
        <Table.Column<Rate>
          key="created_on"
          dataIndex="created_on"
          title={intl.formatMessage({ id: 'AdminRates.createdOn' })}
        />
        <Table.Column<Rate>
          title={intl.formatMessage({ id: 'common.actions' })}
          key="actions"
          render={(_, record) => (
            <Link to={`/admin/rates/edit/${record.id}`}>
              <Edit2Icon size={IconSize.Medium} />
            </Link>
          )}
        />
      </Table>

      <Divider />

      {entities.length > 0 && (
        <Link to="/admin/rates/new">{intl.formatMessage({ id: 'AdminRates.notFound.cta' })}</Link>
      )}
    </>
  );
};

export default AdminRatesList;
