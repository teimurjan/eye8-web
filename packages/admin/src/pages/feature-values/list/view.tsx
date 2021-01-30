/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { LinkButton, NoDataAvailable, Section } from '@eye8/admin-ui';
import { ViewProps as Props } from '@eye8/admin/pages/feature-values/list/presenter';

import { Table, IntlRenderer, FeatureValueTypeRenderer } from '../../../components';

export const NewFeatureValueButton = () => {
  const intl = useIntl();
  return (
    <LinkButton to="/admin/featureValues/new" color="is-primary">
      {intl.formatMessage({ id: 'AdminFeatureValues.notFound.cta' })}
    </LinkButton>
  );
};

const NoFeatureValuesAvialable = () => {
  const intl = useIntl();
  return (
    <NoDataAvailable
      title={intl.formatMessage({ id: 'AdminFeatureValues.notFound.title' })}
      description={intl.formatMessage({
        id: 'AdminFeatureValues.notFound.description',
      })}
      CTA={<NewFeatureValueButton />}
    />
  );
};

const renderNoData = () => <NoFeatureValuesAvialable />;

type FeatureValue = Props['featureValues'][0];

export const AdminFeatureValuesListView = ({ featureValues, isLoading, isDataLoaded }: Props) => {
  const intl = useIntl();
  return (
    <Section
      css={css`
        width: 100%;
      `}
    >
      <Table<FeatureValue>
        pathPrefix="/admin/featureValues"
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        entities={featureValues}
        renderNoData={renderNoData}
      >
        <Table.Col<FeatureValue> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <Table.Col<FeatureValue>
          key_="name"
          title={intl.formatMessage({ id: 'AdminFeatureValues.names' })}
          renderer={new IntlRenderer()}
        />
        <Table.Col<FeatureValue>
          key_="feature_type"
          title={intl.formatMessage({ id: 'AdminFeatureValues.featureType' })}
          renderer={new FeatureValueTypeRenderer(intl.locale)}
        />
      </Table>

      {isDataLoaded && featureValues.length > 0 && <NewFeatureValueButton />}
    </Section>
  );
};
