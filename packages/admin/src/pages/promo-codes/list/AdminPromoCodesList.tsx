import { Table, Tooltip, Divider, TableProps } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { PromoCode } from '@eye8/api';
import { PriceText } from '@eye8/client/components';
import { availableLocales } from '@eye8/shared/utils';

import { useAdminPromoCodesFilters } from '../../../hooks';
import { useAdminPromoCodesState } from '../../../state';

const renderAmount = (promoCode: PromoCode) => {
  return (
    <Tooltip
      title={
        <div>
          {availableLocales.map((locale) => (
            <div key={locale}>
              <PriceText price={promoCode.amount ?? 0} locale={locale} alwaysConvertToPrimary={false} />
            </div>
          ))}
        </div>
      }
    >
      <span>
        <PriceText price={promoCode.amount ?? 0} />
      </span>
    </Tooltip>
  );
};

const AdminPromoCodesList = () => {
  const intl = useIntl();
  const {
    filters: { deleted },
    setFilters,
  } = useAdminPromoCodesFilters();
  const { isListLoading, entities, get: getPromoCodes } = useAdminPromoCodesState();

  useEffect(() => {
    getPromoCodes({ deleted });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleted]);

  const onTableChange: TableProps<PromoCode>['onChange'] = useCallback(
    (_, filters) => {
      setFilters({ deleted: filters.is_deleted?.[0] });
    },
    [setFilters],
  );

  return (
    <>
      <Table<PromoCode> loading={isListLoading} dataSource={entities} onChange={onTableChange} pagination={false}>
        <Table.Column<PromoCode> key="id" dataIndex="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <Table.Column<PromoCode>
          key="value"
          dataIndex="value"
          title={intl.formatMessage({ id: 'AdminPromoCodes.value' })}
        />
        <Table.Column<PromoCode>
          key="discount"
          dataIndex="discount"
          title={intl.formatMessage({ id: 'common.discount' })}
          render={(discount) => `${discount}%`}
        />
        <Table.Column<PromoCode>
          key="amount"
          title={intl.formatMessage({ id: 'AdminPromoCodes.amount' })}
          render={renderAmount}
        />
        <Table.Column<PromoCode>
          key="is_active"
          dataIndex="is_active"
          title={intl.formatMessage({ id: 'AdminPromoCodes.active' })}
          render={(value) => (value ? '✅' : '❌')}
        />
        <Table.Column<PromoCode>
          key="disable_on_use"
          dataIndex="disable_on_use"
          title={intl.formatMessage({ id: 'AdminPromoCodes.disableOnUse' })}
          render={(value) => (value ? '✅' : '❌')}
        />
        <Table.Column<PromoCode>
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
      </Table>

      <Divider />

      {entities.length > 0 && (
        <Link to="/admin/promoCodes/new">{intl.formatMessage({ id: 'AdminPromoCodes.notFound.cta' })}</Link>
      )}
    </>
  );
};

export default AdminPromoCodesList;
