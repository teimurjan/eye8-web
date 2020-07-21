/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { IntlShape, injectIntl } from 'react-intl';

import { ReactRouterLinkButton } from 'src/components/admin-ui/LinkButton/LinkButton';
import { NoDataAvailable } from 'src/components/admin-ui/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/admin-ui/Section/Section';
import { AdminTable } from 'src/components/Admin/AdminTable';
import { IViewProps as IProps } from 'src/components/Admin/Products/List/AdminProductsListPresenter';

export const NewProductButton = injectIntl(({ intl }) => (
  <ReactRouterLinkButton to="/admin/products/new" color="is-primary">
    {intl.formatMessage({ id: 'AdminProducts.notFound.cta' })}
  </ReactRouterLinkButton>
));

const NoProductsAvialable = injectIntl(({ intl }) => (
  <NoDataAvailable
    title={intl.formatMessage({ id: 'AdminProducts.notFound.title' })}
    description={intl.formatMessage({
      id: 'AdminProducts.notFound.description',
    })}
    CTA={
      <ReactRouterLinkButton to="/admin/products/new" color="is-primary">
        {intl.formatMessage({ id: 'AdminProducts.notFound.cta' })}
      </ReactRouterLinkButton>
    }
  />
));

const renderNoData = () => <NoProductsAvialable />;

type Product = IProps['products'][0];

export const AdminProductsListView = ({
  products,
  intl,
  isLoading,
  isDataLoaded,
  meta,
  onPageChange,
}: IProps & { intl: IntlShape }) => (
  <Section
    css={css`
      width: 100%;
    `}
  >
    <AdminTable<Product>
      hideSubheader={true}
      pathPrefix="/admin/products"
      isLoading={isLoading}
      isDataLoaded={isDataLoaded}
      entities={products}
      renderNoData={renderNoData}
      intl={intl}
      currentPage={meta?.page}
      pagesCount={meta?.pages_count}
      onPageChange={onPageChange}
    >
      <AdminTable.Col<Product> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
      <AdminTable.Col<Product> key_="upc" title={intl.formatMessage({ id: 'common.upc' })} />
      <AdminTable.Col<Product> key_="price" title={intl.formatMessage({ id: 'AdminProducts.price' })} />
      <AdminTable.Col<Product> key_="quantity" title={intl.formatMessage({ id: 'AdminProducts.quantity' })} />
      <AdminTable.Col<Product> key_="discount" title={intl.formatMessage({ id: 'AdminProducts.discount' })} />
      <AdminTable.Col<Product>
        key_="product_type"
        title={intl.formatMessage({ id: 'common.productType' })}
        render={product => product.product_type.name}
      />
    </AdminTable>

    {isDataLoaded && products.length > 0 && <NewProductButton />}
  </Section>
);
