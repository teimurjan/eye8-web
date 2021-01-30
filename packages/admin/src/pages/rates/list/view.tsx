/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { LinkButton, NoDataAvailable, Section } from '@eye8/admin-ui';
import { ViewProps as Props } from '@eye8/admin/pages/rates/list/presenter';

import { Table } from '../../../components';

export const NewRateButton = () => {
  const intl = useIntl();
  return (
    <LinkButton to="/admin/rates/new" color="is-primary">
      {intl.formatMessage({ id: 'AdminRates.notFound.cta' })}
    </LinkButton>
  );
};

const NoRatesAvialable = () => {
  const intl = useIntl();
  return <NoDataAvailable title={intl.formatMessage({ id: 'AdminRates.notFound.title' })} CTA={<NewRateButton />} />;
};

const renderNoData = () => <NoRatesAvialable />;

type Rate = Props['rates'][0];

export const AdminRatesListView = ({ rates, isLoading, isDataLoaded }: Props) => {
  const intl = useIntl();
  return (
    <Section
      css={css`
        width: 100%;
      `}
    >
      <Table<Rate>
        hideSubheader={true}
        pathPrefix="/admin/rates"
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        entities={rates}
        renderNoData={renderNoData}
        hideEdit
      >
        <Table.Col<Rate> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <Table.Col<Rate> key_="value" title={intl.formatMessage({ id: 'AdminRates.value' })} />
        <Table.Col<Rate> key_="name" title={intl.formatMessage({ id: 'AdminRates.name' })} />
        <Table.Col<Rate> key_="created_on" title={intl.formatMessage({ id: 'AdminRates.createdOn' })} />
      </Table>

      {isDataLoaded && rates.length > 0 && <NewRateButton />}
    </Section>
  );
};
