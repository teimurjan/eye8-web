/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { IntlShape, injectIntl } from 'react-intl';

import { ReactRouterLinkButton } from 'src/components/admin-ui/LinkButton/LinkButton';
import { NoDataAvailable } from 'src/components/admin-ui/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/admin-ui/Section/Section';
import { AdminTable, IntlRenderer } from 'src/components/Admin/AdminTable';
import { IViewProps as IProps } from 'src/components/Admin/FeatureTypes/List/AdminFeatureTypesListPresenter';

export const NewFeatureTypeButton = injectIntl(({ intl }) => (
  <ReactRouterLinkButton to="/admin/featureTypes/new" color="is-primary">
    {intl.formatMessage({ id: 'AdminFeatureTypes.notFound.cta' })}
  </ReactRouterLinkButton>
));

const NoFeatureTypesAvialable = injectIntl(({ intl }) => (
  <NoDataAvailable
    title={intl.formatMessage({ id: 'AdminFeatureTypes.notFound.title' })}
    description={intl.formatMessage({
      id: 'AdminFeatureTypes.notFound.description',
    })}
    CTA={<NewFeatureTypeButton />}
  />
));

const renderNoData = () => <NoFeatureTypesAvialable />;

type FeatureType = IProps['featureTypes'][0];

export const AdminFeatureTypesListView = ({
  featureTypes,
  locales,
  intl,
  isLoading,
  isDataLoaded,
}: IProps & { intl: IntlShape }) => (
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
      intl={intl}
    >
      <AdminTable.Col<FeatureType> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
      <AdminTable.Col<FeatureType>
        key_="name"
        title={intl.formatMessage({ id: 'AdminFeatureTypes.names' })}
        renderer={new IntlRenderer(locales)}
      />
    </AdminTable>

    {isDataLoaded && featureTypes.length > 0 && <NewFeatureTypeButton />}
  </Section>
);
