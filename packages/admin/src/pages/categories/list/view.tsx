/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { LinkButton, NoDataAvailable, Section } from '@eye8/admin-ui';
import { ViewProps as Props } from '@eye8/admin/pages/categories/list/presenter';

import { Table, IntlRenderer } from '../../../components';

export const NewCategoryButton = () => {
  const intl = useIntl();
  return (
    <LinkButton to="/admin/categories/new" color="is-primary">
      {intl.formatMessage({ id: 'AdminCategories.notFound.cta' })}
    </LinkButton>
  );
};

const NoCategoriesAvialable = () => {
  const intl = useIntl();
  return (
    <NoDataAvailable
      title={intl.formatMessage({ id: 'AdminCategories.notFound.title' })}
      description={intl.formatMessage({
        id: 'AdminCategories.notFound.description',
      })}
      CTA={
        <LinkButton to="/admin/categories/new" color="is-primary">
          {intl.formatMessage({ id: 'AdminCategories.notFound.cta' })}
        </LinkButton>
      }
    />
  );
};

const renderNoData = () => <NoCategoriesAvialable />;

type Category = Props['categories'][0];

export const AdminCategoriesListView = ({ categories, isLoading, isDataLoaded }: Props) => {
  const intl = useIntl();
  return (
    <Section
      css={css`
        width: 100%;
      `}
    >
      <Table<Category>
        pathPrefix="/admin/categories"
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        entities={categories}
        renderNoData={renderNoData}
      >
        <Table.Col<Category> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <Table.Col<Category>
          key_="parent_category_id"
          title={intl.formatMessage({
            id: 'AdminCategories.parentCategoryID',
          })}
        />
        <Table.Col<Category>
          key_="name"
          title={intl.formatMessage({ id: 'AdminCategories.names' })}
          renderer={new IntlRenderer()}
        />
      </Table>

      {isDataLoaded && categories.length > 0 && <NewCategoryButton />}
    </Section>
  );
};
