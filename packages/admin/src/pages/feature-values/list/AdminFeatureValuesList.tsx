import { Table, Space, Divider } from 'antd';
import React from 'react';
import { Trash as TrashIcon, Edit2 as Edit2Icon } from 'react-feather';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { FeatureValue } from '@eye8/api';
import { IconSize } from '@eye8/shared/styles';
import { availableLocales, getLocaleName } from '@eye8/shared/utils';

import { useAdminFeatureValuesState } from '../../../state';

const AdminFeatureValuesList = () => {
  const intl = useIntl();
  const { isListLoading, entities, get } = useAdminFeatureValuesState();

  React.useEffect(() => {
    get();
  }, [get]);

  return (
    <>
      <Table<FeatureValue<true>>
        locale={{ emptyText: intl.formatMessage({ id: 'AdminFeatureValues.notFound.title' }) }}
        loading={isListLoading}
        dataSource={entities}
        pagination={false}
      >
        <Table.Column<FeatureValue<true>> key="id" dataIndex="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <Table.ColumnGroup<FeatureValue<true>>
          key="name"
          title={intl.formatMessage({ id: 'AdminFeatureValues.names' })}
        >
          {availableLocales.map((locale) => (
            <Table.Column<FeatureValue<true>>
              key={`name_${locale}`}
              dataIndex={['name', locale]}
              title={getLocaleName(locale)}
            />
          ))}
        </Table.ColumnGroup>
        <Table.Column<FeatureValue<true>>
          title={intl.formatMessage({ id: 'common.actions' })}
          key="actions"
          render={(_, record) => (
            <Space size="middle">
              <Link to={`/admin/characteristicValues/edit/${record.id}`}>
                <Edit2Icon size={IconSize.Medium} />
              </Link>
              <Link to={`/admin/characteristicValues/delete/${record.id}`}>
                <TrashIcon size={IconSize.Medium} />
              </Link>
            </Space>
          )}
        />
      </Table>

      <Divider />

      {entities.length > 0 && (
        <Link to="/admin/characteristicValues/new">
          {intl.formatMessage({ id: 'AdminFeatureValues.notFound.cta' })}
        </Link>
      )}
    </>
  );
};

export default AdminFeatureValuesList;
