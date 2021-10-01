import { Table, Space, Divider, Image } from 'antd';
import React from 'react';
import { Trash as TrashIcon, Edit2 as Edit2Icon } from 'react-feather';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { Banner } from '@eye8/api';
import { IconSize } from '@eye8/shared/styles';

import { useAdminBannersState } from '../../../state';

const AdminBannersList = () => {
  const intl = useIntl();
  const { isListLoading, entities, get } = useAdminBannersState();

  React.useEffect(() => {
    get();
  }, [get]);

  return (
    <>
      <Table<Banner<true>>
        locale={{ emptyText: intl.formatMessage({ id: 'AdminBanners.notFound.title' }) }}
        loading={isListLoading}
        dataSource={entities}
        pagination={false}
      >
        <Table.Column<Banner<true>> key="id" dataIndex="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <Table.Column<Banner<true>>
          key="link"
          dataIndex="link"
          title={intl.formatMessage({ id: 'AdminBanners.link' })}
          responsive={['md']}
        />
        <Table.Column<Banner<true>>
          title={intl.formatMessage({ id: 'AdminBanners.image' })}
          key="image"
          render={(_, record) => <Image src={record.image} />}
          width={200}
        />
        <Table.Column<Banner<true>>
          title={intl.formatMessage({ id: 'common.actions' })}
          key="actions"
          render={(_, record) => (
            <Space size="middle">
              <Link to={`/admin/banners/edit/${record.id}`}>
                <Edit2Icon size={IconSize.Medium} />
              </Link>
              <Link to={`/admin/banners/delete/${record.id}`}>
                <TrashIcon size={IconSize.Medium} />
              </Link>
            </Space>
          )}
        />
      </Table>

      <Divider />

      {entities.length > 0 && (
        <Link to="/admin/banners/new">{intl.formatMessage({ id: 'AdminBanners.notFound.cta' })}</Link>
      )}
    </>
  );
};

export default AdminBannersList;
