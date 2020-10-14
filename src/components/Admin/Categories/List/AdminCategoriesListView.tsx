/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { IntlShape, injectIntl } from 'react-intl';

import { ReactRouterLinkButton } from 'src/components/admin-ui/LinkButton/LinkButton';
import { NoDataAvailable } from 'src/components/admin-ui/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/admin-ui/Section/Section';
import { AdminTable, IntlRenderer } from 'src/components/Admin/AdminTable';
import { IViewProps as IProps } from 'src/components/Admin/Categories/List/AdminCategoriesListPresenter';

export const NewCategoryButton = injectIntl(({ intl }) => (
  <ReactRouterLinkButton to="/admin/categories/new" color="is-primary">
    {intl.formatMessage({ id: 'AdminCategories.notFound.cta' })}
  </ReactRouterLinkButton>
));

const NoCategoriesAvialable = injectIntl(({ intl }) => (
  <NoDataAvailable
    title={intl.formatMessage({ id: 'AdminCategories.notFound.title' })}
    description={intl.formatMessage({
      id: 'AdminCategories.notFound.description',
    })}
    CTA={
      <ReactRouterLinkButton to="/admin/categories/new" color="is-primary">
        {intl.formatMessage({ id: 'AdminCategories.notFound.cta' })}
      </ReactRouterLinkButton>
    }
  />
));

const renderNoData = () => <NoCategoriesAvialable />;

type Category = IProps['categories'][0];

export const AdminCategoriesListView = ({
  categories,
  intl,
  isLoading,
  isDataLoaded,
}: IProps & { intl: IntlShape }) => (
  <Section
    css={css`
      width: 100%;
    `}
  >
    <AdminTable<Category>
      pathPrefix="/admin/categories"
      isLoading={isLoading}
      isDataLoaded={isDataLoaded}
      entities={categories}
      renderNoData={renderNoData}
      intl={intl}
    >
      <AdminTable.Col<Category> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
      <AdminTable.Col<Category>
        key_="parent_category_id"
        title={intl.formatMessage({
          id: 'AdminCategories.parentCategoryID',
        })}
      />
      <AdminTable.Col<Category>
        key_="name"
        title={intl.formatMessage({ id: 'AdminCategories.names' })}
        renderer={new IntlRenderer()}
      />
    </AdminTable>

    {isDataLoaded && categories.length > 0 && <NewCategoryButton />}
  </Section>
);
