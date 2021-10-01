import { Table, Space, Divider } from 'antd';
import React from 'react';
import { Trash as TrashIcon, Edit2 as Edit2Icon } from 'react-feather';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { Category } from '@eye8/api';
import { IconSize } from '@eye8/shared/styles';
import { availableLocales, getLocaleName } from '@eye8/shared/utils';

import { useAdminCategoriesState } from '../../../state';

const AdminCategoriesList = () => {
  const intl = useIntl();
  const { isListLoading, entities, get } = useAdminCategoriesState();

  React.useEffect(() => {
    get();
  }, [get]);

  return (
    <>
      <Table<Category<true>>
        locale={{ emptyText: intl.formatMessage({ id: 'AdminCategories.notFound.title' }) }}
        loading={isListLoading}
        dataSource={entities}
        pagination={false}
      >
        <Table.Column<Category<true>> key="id" dataIndex="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <Table.Column<Category<true>>
          key="parent_category_id"
          dataIndex="parent_category_id"
          title={intl.formatMessage({
            id: 'AdminCategories.parentCategoryID',
          })}
          responsive={['md']}
        />
        <Table.ColumnGroup<Category<true>> key="name" title={intl.formatMessage({ id: 'AdminCategories.names' })}>
          {availableLocales.map((locale) => (
            <Table.Column<Category<true>>
              key={`name_${locale}`}
              dataIndex={['name', locale]}
              title={getLocaleName(locale)}
            />
          ))}
        </Table.ColumnGroup>
        <Table.Column<Category<true>>
          title={intl.formatMessage({ id: 'common.actions' })}
          key="actions"
          render={(_, record) => (
            <Space size="middle">
              <Link to={`/admin/categories/edit/${record.id}`}>
                <Edit2Icon size={IconSize.Medium} />
              </Link>
              <Link to={`/admin/categories/delete/${record.id}`}>
                <TrashIcon size={IconSize.Medium} />
              </Link>
            </Space>
          )}
        />
      </Table>

      <Divider />

      {entities.length > 0 && (
        <Link to="/admin/categories/new">{intl.formatMessage({ id: 'AdminCategories.notFound.cta' })}</Link>
      )}
    </>
  );
};

export default AdminCategoriesList;
