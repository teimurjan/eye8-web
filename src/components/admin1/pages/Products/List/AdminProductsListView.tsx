/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { Checkbox } from 'src/components/admin-ui/Checkbox/Checkbox';
import { ReactRouterLinkButton } from 'src/components/admin-ui/LinkButton/LinkButton';
import { NoDataAvailable } from 'src/components/admin-ui/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/admin-ui/Section/Section';
import { ProductTypeSelectView } from 'src/components/admin/form/ProductTypeSelect/ProductTypeSelectView';
import { IViewProps as IProps } from 'src/components/admin/pages/Products/List/AdminProductsListPresenter';
import { AdminFiltersSection } from 'src/components/admin/table/AdminFiltersSection';
import { AdminTable, PriceRenderer } from 'src/components/admin/table/AdminTable';
import { noop } from 'src/utils/function';

export const NewProductButton = () => {
  const intl = useIntl();
  return (
    <ReactRouterLinkButton to="/admin/products/new" color="is-primary">
      {intl.formatMessage({ id: 'AdminProducts.notFound.cta' })}
    </ReactRouterLinkButton>
  );
};

const NoProductsAvialable = () => {
  const intl = useIntl();
  return (
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
  );
};

const renderNoData = () => <NoProductsAvialable />;

type Product = IProps['products'][0];

export const AdminProductsListView = ({
  products,
  isLoading,
  isDataLoaded,
  meta,
  onPageChange,
  selectedProductTypeId,
  LoadMoreProductTypes,
  productTypesLoading,
  productTypes,
  onProductTypeChange,
  onAvailabilityChange,
  available,
}: IProps) => {
  const intl = useIntl();
  return (
    <Section
      css={css`
        width: 100%;
      `}
    >
      <AdminFiltersSection>
        <ProductTypeSelectView<string | undefined>
          meta={{}}
          input={{
            name: 'productTypeSelect',
            onChange: onProductTypeChange,
            onBlur: noop,
            onFocus: noop,
            value: selectedProductTypeId?.toString(),
            placeholder: intl.formatMessage({ id: 'AdminProducts.productTypeSelect.placeholder' }),
          }}
          LoadMoreProductTypes={LoadMoreProductTypes}
          productTypesLoading={productTypesLoading}
          productTypes={productTypes}
          clearable
        />
        <Checkbox
          label={intl.formatMessage({ id: 'common.availabilityFilter' })}
          onChange={onAvailabilityChange}
          checked={available}
        />
      </AdminFiltersSection>

      <AdminTable<Product>
        hideSubheader={true}
        pathPrefix="/admin/products"
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        entities={products}
        renderNoData={renderNoData}
        currentPage={meta?.page}
        pagesCount={meta?.pages_count}
        onPageChange={onPageChange}
      >
        <AdminTable.Col<Product> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <AdminTable.Col<Product>
          key_="price"
          title={intl.formatMessage({ id: 'AdminProducts.price' })}
          renderer={new PriceRenderer()}
        />
        <AdminTable.Col<Product> key_="quantity" title={intl.formatMessage({ id: 'AdminProducts.quantity' })} />
        <AdminTable.Col<Product>
          key_="discount"
          title={intl.formatMessage({ id: 'common.discount' })}
          render={(product) => `${product.discount}%`}
        />
        <AdminTable.Col<Product>
          key_="product_type"
          title={intl.formatMessage({ id: 'common.productType' })}
          render={(product) => product.product_type.name}
        />
      </AdminTable>

      {isDataLoaded && !isLoading && products.length > 0 && <NewProductButton />}
    </Section>
  );
};
