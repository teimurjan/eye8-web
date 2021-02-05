/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { LinkButton, NoDataAvailable, Section } from '@eye8/admin-ui';

import { Table, IntlRenderer } from '../../../components';

import { ViewProps as Props } from './presenter';

export const NewFeatureTypeButton = () => {
  const intl = useIntl();
  return (
    <LinkButton to="/admin/featureTypes/new" color="is-primary">
      {intl.formatMessage({ id: 'AdminFeatureTypes.notFound.cta' })}
    </LinkButton>
  );
};

const NoFeatureTypesAvialable = () => {
  const intl = useIntl();
  return (
    <NoDataAvailable
      title={intl.formatMessage({ id: 'AdminFeatureTypes.notFound.title' })}
      description={intl.formatMessage({
        id: 'AdminFeatureTypes.notFound.description',
      })}
      CTA={<NewFeatureTypeButton />}
    />
  );
};

const renderNoData = () => <NoFeatureTypesAvialable />;

type FeatureType = Props['featureTypes'][0];

const AdminFeatureTypesListView = ({ featureTypes, isLoading, isDataLoaded }: Props) => {
  const intl = useIntl();
  return (
    <Section
      css={css`
        width: 100%;
      `}
    >
      <Table<FeatureType>
        pathPrefix="/admin/featureTypes"
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        entities={featureTypes}
        renderNoData={renderNoData}
      >
        <Table.Col<FeatureType> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <Table.Col<FeatureType>
          key_="name"
          title={intl.formatMessage({ id: 'AdminFeatureTypes.names' })}
          renderer={new IntlRenderer()}
        />
      </Table>

      {isDataLoaded && featureTypes.length > 0 && <NewFeatureTypeButton />}
    </Section>
  );
};

export default AdminFeatureTypesListView;
