/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { LinkButton, NoDataAvailable, Section } from '@eye8/admin-ui/index';
import { AdminTable, IntlRenderer } from '@eye8/admin/components/table';
import { IViewProps as IProps } from '@eye8/admin/pages/feature-types/list/presenter';

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

type FeatureType = IProps['featureTypes'][0];

export const AdminFeatureTypesListView = ({ featureTypes, isLoading, isDataLoaded }: IProps) => {
  const intl = useIntl();
  return (
    <Section
      css={css`
        width: 100%;
      `}
    >
      <AdminTable<FeatureType>
        pathPrefix="/admin/featureTypes"
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        entities={featureTypes}
        renderNoData={renderNoData}
      >
        <AdminTable.Col<FeatureType> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <AdminTable.Col<FeatureType>
          key_="name"
          title={intl.formatMessage({ id: 'AdminFeatureTypes.names' })}
          renderer={new IntlRenderer()}
        />
      </AdminTable>

      {isDataLoaded && featureTypes.length > 0 && <NewFeatureTypeButton />}
    </Section>
  );
};
