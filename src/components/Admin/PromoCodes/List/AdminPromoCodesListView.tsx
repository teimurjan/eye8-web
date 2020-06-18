/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { injectIntl, useIntl } from 'react-intl';

import { ReactRouterLinkButton } from 'src/components/admin-ui/LinkButton/LinkButton';
import { NoDataAvailable } from 'src/components/admin-ui/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/admin-ui/Section/Section';
import { AdminTable } from 'src/components/Admin/AdminTable';
import { IViewProps as IProps } from 'src/components/Admin/PromoCodes/List/AdminPromoCodesListPresenter';

export const NewPromoCodeButton = injectIntl(({ intl }) => (
  <ReactRouterLinkButton to="/admin/promoCodes/new" color="is-primary">
    {intl.formatMessage({ id: 'AdminPromoCodes.notFound.cta' })}
  </ReactRouterLinkButton>
));

const NoPromoCodesAvialable = injectIntl(({ intl }) => (
  <NoDataAvailable title={intl.formatMessage({ id: 'AdminPromoCodes.notFound.title' })} CTA={<NewPromoCodeButton />} />
));

const renderNoData = () => <NoPromoCodesAvialable />;

type PromoCode = IProps['promoCodes'][0];

export const AdminPromoCodesListView = ({ promoCodes, isLoading, isDataLoaded }: IProps) => {
  const intl = useIntl();
  return (
    <Section
      css={css`
        width: 100%;
      `}
    >
      <AdminTable<PromoCode>
        hideSubheader={true}
        pathPrefix="/admin/promoCodes"
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        entities={promoCodes}
        renderNoData={renderNoData}
        intl={intl}
      >
        <AdminTable.Col<PromoCode> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <AdminTable.Col<PromoCode> key_="value" title={intl.formatMessage({ id: 'AdminPromoCodes.value' })} />
        <AdminTable.Col<PromoCode> key_="discount" title={intl.formatMessage({ id: 'AdminPromoCodes.discount' })} />
        <AdminTable.Col<PromoCode>
          key_="is_active"
          title={intl.formatMessage({ id: 'AdminPromoCodes.active' })}
          render={value => (value.is_active ? '✅' : '❌')}
        />
        <AdminTable.Col<PromoCode>
          key_="disable_on_use"
          title={intl.formatMessage({ id: 'AdminPromoCodes.disableOnUse' })}
          render={value => (value.disable_on_use ? '✅' : '❌')}
        />
      </AdminTable>

      {isDataLoaded && promoCodes.length > 0 && <NewPromoCodeButton />}
    </Section>
  );
};
