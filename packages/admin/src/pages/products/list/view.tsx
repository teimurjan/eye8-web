/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { Checkbox, LinkButton, NoDataAvailable, Section } from '@eye8/admin-ui';
import { AdminFiltersSection } from '@eye8/admin/components/filters-section';
import { ProductFeaturesRenderer } from '@eye8/admin/components/product-features-renderer';
import { ProductProductTypeRenderer } from '@eye8/admin/components/product-product-type-renderer';
import { ProductTypeSelectView } from '@eye8/admin/components/product-type-select';
import { AdminTable, PriceRenderer } from '@eye8/admin/components/table';
import { ViewProps as Props } from '@eye8/admin/pages/products/list/presenter';
import { noop } from '@eye8/shared/utils';

export const NewProductButton = () => {
  const intl = useIntl();
  return (
    <LinkButton to="/admin/products/new" color="is-primary">
      {intl.formatMessage({ id: 'AdminProducts.notFound.cta' })}
    </LinkButton>
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
        <LinkButton to="/admin/products/new" color="is-primary">
          {intl.formatMessage({ id: 'AdminProducts.notFound.cta' })}
        </LinkButton>
      }
    />
  );
};

const renderNoData = () => <NoProductsAvialable />;

type Product = Props['products'][0];

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
  onDeletedChange,
  deleted,
  available,
}: Props) => {
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
        <Checkbox
          label={intl.formatMessage({ id: 'common.showDeleted' })}
          onChange={onDeletedChange}
          checked={deleted}
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
          renderer={new ProductProductTypeRenderer()}
        />
        <AdminTable.Col<Product>
          key_="product_type"
          title={intl.formatMessage({ id: 'AdminProducts.features' })}
          renderer={new ProductFeaturesRenderer()}
        />
      </AdminTable>

      {isDataLoaded && !isLoading && products.length > 0 && <NewProductButton />}
    </Section>
  );
};
