
import { css } from '@emotion/react';
import { useIntl } from 'react-intl';

import { Checkbox, LinkButton, NoDataAvailable, Section } from '@eye8/admin-ui';
import { noop } from '@eye8/shared/utils';

import {
  Table,
  PriceRenderer,
  FiltersSection,
  ProductFeaturesRenderer,
  ProductProductTypeRenderer,
  ProductTypeSelect,
} from '../../../components';

import { ViewProps as Props } from './presenter';

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

const AdminProductsListView = ({
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
      <FiltersSection>
        <ProductTypeSelect<string | undefined>
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
      </FiltersSection>

      <Table<Product>
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
        <Table.Col<Product> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <Table.Col<Product>
          key_="price"
          title={intl.formatMessage({ id: 'AdminProducts.price' })}
          renderer={new PriceRenderer()}
        />
        <Table.Col<Product> key_="quantity" title={intl.formatMessage({ id: 'AdminProducts.quantity' })} />
        <Table.Col<Product>
          key_="discount"
          title={intl.formatMessage({ id: 'common.discount' })}
          render={(product) => `${product.discount}%`}
        />
        <Table.Col<Product>
          key_="product_type"
          title={intl.formatMessage({ id: 'common.productType' })}
          renderer={new ProductProductTypeRenderer()}
        />
        <Table.Col<Product>
          key_="product_type"
          title={intl.formatMessage({ id: 'AdminProducts.features' })}
          renderer={new ProductFeaturesRenderer()}
        />
      </Table>

      {isDataLoaded && !isLoading && products.length > 0 && <NewProductButton />}
    </Section>
  );
};

export default AdminProductsListView;
