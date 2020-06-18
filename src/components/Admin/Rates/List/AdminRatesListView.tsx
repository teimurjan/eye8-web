/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { injectIntl, useIntl } from 'react-intl';

import { ReactRouterLinkButton } from 'src/components/admin-ui/LinkButton/LinkButton';
import { NoDataAvailable } from 'src/components/admin-ui/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/admin-ui/Section/Section';
import { AdminTable } from 'src/components/Admin/AdminTable';
import { IViewProps as IProps } from 'src/components/Admin/Rates/List/AdminRatesListPresenter';

export const NewRateButton = injectIntl(({ intl }) => (
  <ReactRouterLinkButton to="/admin/rates/new" color="is-primary">
    {intl.formatMessage({ id: 'AdminRates.notFound.cta' })}
  </ReactRouterLinkButton>
));

const NoRatesAvialable = injectIntl(({ intl }) => (
  <NoDataAvailable title={intl.formatMessage({ id: 'AdminRates.notFound.title' })} CTA={<NewRateButton />} />
));

const renderNoData = () => <NoRatesAvialable />;

type Rate = IProps['rates'][0];

export const AdminRatesListView = ({ rates, isLoading, isDataLoaded }: IProps) => {
  const intl = useIntl();
  return (
    <Section
      css={css`
        width: 100%;
      `}
    >
      <AdminTable<Rate>
        hideSubheader={true}
        pathPrefix="/admin/rates"
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        entities={rates}
        renderNoData={renderNoData}
        intl={intl}
        hideEdit
      >
        <AdminTable.Col<Rate> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <AdminTable.Col<Rate> key_="value" title={intl.formatMessage({ id: 'AdminRates.value' })} />
        <AdminTable.Col<Rate> key_="name" title={intl.formatMessage({ id: 'AdminRates.name' })} />
        <AdminTable.Col<Rate> key_="created_on" title={intl.formatMessage({ id: 'AdminRates.createdOn' })} />
      </AdminTable>

      {isDataLoaded && rates.length > 0 && <NewRateButton />}
    </Section>
  );
};
