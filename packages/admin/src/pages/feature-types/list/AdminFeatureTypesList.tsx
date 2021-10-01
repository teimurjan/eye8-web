import { Table, Space, Divider } from 'antd';
import React from 'react';
import { Trash as TrashIcon, Edit2 as Edit2Icon } from 'react-feather';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { FeatureType } from '@eye8/api';
import { IconSize } from '@eye8/shared/styles';
import { availableLocales, getLocaleName } from '@eye8/shared/utils';

import { useAdminFeatureTypesState } from '../../../state';

const AdminFeatureTypesList = () => {
  const intl = useIntl();
  const { isListLoading, entities, get } = useAdminFeatureTypesState();

  React.useEffect(() => {
    get();
  }, [get]);

  return (
    <>
      <Table<FeatureType<true>>
        locale={{ emptyText: intl.formatMessage({ id: 'AdminFeatureTypes.notFound.title' }) }}
        loading={isListLoading}
        dataSource={entities}
        pagination={false}
      >
        <Table.Column<FeatureType<true>>
          key="id"
          dataIndex="id"
          title={intl.formatMessage({ id: 'common.ID' })}
        />
        <Table.ColumnGroup<FeatureType<true>>
          key="name"
          title={intl.formatMessage({ id: 'AdminFeatureTypes.names' })}
        >
          {availableLocales.map((locale) => (
            <Table.Column<FeatureType<true>>
              key={`name_${locale}`}
              dataIndex={['name', locale]}
              title={getLocaleName(locale)}
            />
          ))}
        </Table.ColumnGroup>
        <Table.Column<FeatureType<true>>
          title={intl.formatMessage({ id: 'common.actions' })}
          key="actions"
          render={(_, record) => (
            <Space size="middle">
              <Link to={`/admin/featureTypes/edit/${record.id}`}>
                <Edit2Icon size={IconSize.Medium} />
              </Link>
              <Link to={`/admin/featureTypes/delete/${record.id}`}>
                <TrashIcon size={IconSize.Medium} />
              </Link>
            </Space>
          )}
        />
      </Table>

      <Divider />

      {entities.length > 0 && (
        <Link to="/admin/featureTypes/new">{intl.formatMessage({ id: 'AdminFeatureTypes.notFound.cta' })}</Link>
      )}
    </>
  );
};

export default AdminFeatureTypesList;
