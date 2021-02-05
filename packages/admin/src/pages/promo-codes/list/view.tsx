/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { Checkbox, NoDataAvailable, Section } from '@eye8/admin-ui';

import { Table, BooleanRenderer, PriceRenderer, FiltersSection, NewButton } from '../../../components';

import { ViewProps as Props } from './presenter';

type PromoCode = Props['promoCodes'][0];

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

const AdminPromoCodesListView = ({ promoCodes, isLoading, isDataLoaded, deleted, onDeletedChange }: Props) => {
  const intl = useIntl();
  return (
    <Section
      css={css`
        width: 100%;
      `}
    >
      <FiltersSection>
        <Checkbox
          label={intl.formatMessage({ id: 'common.showDeleted' })}
          onChange={onDeletedChange}
          checked={deleted}
        />
      </FiltersSection>

      <Table<PromoCode>
        hideSubheader={true}
        pathPrefix="/admin/promoCodes"
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        entities={promoCodes}
        renderNoData={() => <NoPromoCodesAvialable />}
      >
        <Table.Col<PromoCode> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <Table.Col<PromoCode> key_="value" title={intl.formatMessage({ id: 'AdminPromoCodes.value' })} />
        <Table.Col<PromoCode>
          key_="discount"
          title={intl.formatMessage({ id: 'common.discount' })}
          render={(product) => `${product.discount}%`}
        />
        <Table.Col<PromoCode>
          key_="amount"
          title={intl.formatMessage({ id: 'AdminPromoCodes.amount' })}
          renderer={new PriceRenderer()}
        />
        <Table.Col<PromoCode>
          key_="is_active"
          title={intl.formatMessage({ id: 'AdminPromoCodes.active' })}
          renderer={new BooleanRenderer()}
        />
        <Table.Col<PromoCode>
          key_="disable_on_use"
          title={intl.formatMessage({ id: 'AdminPromoCodes.disableOnUse' })}
          renderer={new BooleanRenderer()}
        />
        <Table.Col<PromoCode>
          key_="is_deleted"
          title={intl.formatMessage({ id: 'common.deleted' })}
          renderer={new BooleanRenderer()}
        />
      </Table>

      {isDataLoaded && promoCodes.length > 0 && <NewPromoCodeButton />}
    </Section>
  );
};

export default AdminPromoCodesListView;
