import { Table, Space, Divider } from 'antd';
import React from 'react';
import { Trash as TrashIcon, Edit2 as Edit2Icon } from 'react-feather';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { Characteristic } from '@eye8/api';
import { IconSize } from '@eye8/shared/styles';
import { availableLocales, getLocaleName } from '@eye8/shared/utils';

import { useAdminCharacteristicsState } from '../../../state';

const AdminCharacteristicsList = () => {
  const intl = useIntl();
  const { isListLoading, entities, get } = useAdminCharacteristicsState();

  React.useEffect(() => {
    get();
  }, [get]);

  return (
    <>
      <Table<Characteristic<true>>
        locale={{ emptyText: intl.formatMessage({ id: 'AdminCharacteristics.notFound.title' }) }}
        loading={isListLoading}
        dataSource={entities}
        pagination={false}
      >
        <Table.Column<Characteristic<true>>
          key="id"
          dataIndex="id"
          title={intl.formatMessage({ id: 'common.ID' })}
        />
        <Table.ColumnGroup<Characteristic<true>>
          key="name"
          title={intl.formatMessage({ id: 'AdminCharacteristics.names' })}
        >
          {availableLocales.map((locale) => (
            <Table.Column<Characteristic<true>>
              key={`name_${locale}`}
              dataIndex={['name', locale]}
              title={getLocaleName(locale)}
            />
          ))}
        </Table.ColumnGroup>
        <Table.Column<Characteristic<true>>
          title={intl.formatMessage({ id: 'common.actions' })}
          key="actions"
          render={(_, record) => (
            <Space size="middle">
              <Link to={`/admin/characteristics/edit/${record.id}`}>
                <Edit2Icon size={IconSize.Medium} />
              </Link>
              <Link to={`/admin/characteristics/delete/${record.id}`}>
                <TrashIcon size={IconSize.Medium} />
              </Link>
            </Space>
          )}
        />
      </Table>

      <Divider />

      {entities.length > 0 && (
        <Link to="/admin/characteristics/new">{intl.formatMessage({ id: 'AdminCharacteristics.notFound.cta' })}</Link>
      )}
    </>
  );
};

export default AdminCharacteristicsList;
