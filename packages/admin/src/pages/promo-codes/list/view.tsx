/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { Checkbox, NoDataAvailable, Section } from '@eye8/admin-ui/index';
import { AdminFiltersSection } from '@eye8/admin/components/filters-section';
import { NewButton } from '@eye8/admin/components/new-button';
import { AdminTable, BooleanRenderer, PriceRenderer } from '@eye8/admin/components/table';
import { IViewProps as IProps } from '@eye8/admin/pages/promo-codes/list/presenter';

type PromoCode = IProps['promoCodes'][0];

const NewPromoCodeButton = () => {
  const intl = useIntl();
  return (
    <NewButton pathPrefix="/admin/promoCodes">{intl.formatMessage({ id: 'AdminPromoCodes.notFound.cta' })}</NewButton>
  );
};

const NoPromoCodesAvialable = () => {
  const intl = useIntl();
  return (
    <NoDataAvailable
      title={intl.formatMessage({ id: 'AdminPromoCodes.notFound.title' })}
      CTA={<NewPromoCodeButton />}
    />
  );
};

export const AdminPromoCodesListView = ({ promoCodes, isLoading, isDataLoaded, deleted, onDeletedChange }: IProps) => {
  const intl = useIntl();
  return (
    <Section
      css={css`
        width: 100%;
      `}
    >
      <AdminFiltersSection>
        <Checkbox
          label={intl.formatMessage({ id: 'common.showDeleted' })}
          onChange={onDeletedChange}
          checked={deleted}
        />
      </AdminFiltersSection>

      <AdminTable<PromoCode>
        hideSubheader={true}
        pathPrefix="/admin/promoCodes"
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        entities={promoCodes}
        renderNoData={() => <NoPromoCodesAvialable />}
      >
        <AdminTable.Col<PromoCode> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <AdminTable.Col<PromoCode> key_="value" title={intl.formatMessage({ id: 'AdminPromoCodes.value' })} />
        <AdminTable.Col<PromoCode>
          key_="discount"
          title={intl.formatMessage({ id: 'common.discount' })}
          render={(product) => `${product.discount}%`}
        />
        <AdminTable.Col<PromoCode>
          key_="amount"
          title={intl.formatMessage({ id: 'AdminPromoCodes.amount' })}
          renderer={new PriceRenderer()}
        />
        <AdminTable.Col<PromoCode>
          key_="is_active"
          title={intl.formatMessage({ id: 'AdminPromoCodes.active' })}
          renderer={new BooleanRenderer()}
        />
        <AdminTable.Col<PromoCode>
          key_="disable_on_use"
          title={intl.formatMessage({ id: 'AdminPromoCodes.disableOnUse' })}
          renderer={new BooleanRenderer()}
        />
        <AdminTable.Col<PromoCode>
          key_="is_deleted"
          title={intl.formatMessage({ id: 'common.deleted' })}
          renderer={new BooleanRenderer()}
        />
      </AdminTable>

      {isDataLoaded && promoCodes.length > 0 && <NewPromoCodeButton />}
    </Section>
  );
};
