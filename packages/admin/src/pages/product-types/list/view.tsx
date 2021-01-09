/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { Checkbox, NoDataAvailable, Section } from '@eye8/admin-ui';
import { AdminFiltersSection } from '@eye8/admin/components/filters-section';
import { NewButton } from '@eye8/admin/components/new-button';
import { AdminTable, IntlRenderer, ImageRenderer, LinkRenderer, BooleanRenderer } from '@eye8/admin/components/table';
import { ViewProps as Props } from '@eye8/admin/pages/product-types/list/presenter';

export const NewProductTypeButton = () => {
  const intl = useIntl();
  return (
    <NewButton pathPrefix="/admin/productTypes">
      {intl.formatMessage({ id: 'AdminProductTypes.notFound.cta' })}
    </NewButton>
  );
};

const NoProductTypesAvialable = () => {
  const intl = useIntl();
  return (
    <NoDataAvailable
      title={intl.formatMessage({ id: 'AdminProductTypes.notFound.title' })}
      description={intl.formatMessage({
        id: 'AdminProductTypes.notFound.description',
      })}
      CTA={<NewProductTypeButton />}
    />
  );
};

type ProductType = Props['productTypes'][0];

export const AdminProductTypesListView = ({
  productTypes,
  isLoading,
  isDataLoaded,
  meta,
  onPageChange,
  onDeletedChange,
  onAvailabilityChange,
  onSearchChange,
  available,
  deleted,
}: Props) => {
  const intl = useIntl();
  return (
    <Section
      css={css`
        width: 100%;
      `}
    >
      <AdminFiltersSection>
        <Checkbox
          label={intl.formatMessage({ id: 'common.showDeleted' })}
          onChange={onDeletedChange}
          checked={deleted}
        />
        <Checkbox
          label={intl.formatMessage({ id: 'common.availabilityFilter' })}
          onChange={onAvailabilityChange}
          checked={available}
        />
      </AdminFiltersSection>
      <AdminTable<ProductType>
        pathPrefix="/admin/productTypes"
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        entities={productTypes}
        renderNoData={() => <NoProductTypesAvialable />}
        currentPage={meta?.page}
        pagesCount={meta?.pages_count}
        onPageChange={onPageChange}
        onSearchChange={onSearchChange}
      >
        <AdminTable.Col<ProductType> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <AdminTable.Col<ProductType>
          key_="name"
          title={intl.formatMessage({ id: 'AdminProductTypes.names' })}
          renderer={new IntlRenderer()}
        />
        <AdminTable.Col<ProductType>
          key_="image"
          title={intl.formatMessage({ id: 'AdminProductTypes.image' })}
          renderer={new ImageRenderer((productType) => productType.name[intl.locale])}
        />
        <AdminTable.Col<ProductType>
          key_="id"
          title=""
          renderer={
            new LinkRenderer((entity) => ({
              to: `/admin/products?productTypeId=${entity.id}`,
              text: intl.formatMessage({ id: 'AdminProductTypes.productsLink' }),
            }))
          }
        />
        <AdminTable.Col<ProductType>
          key_="is_deleted"
          title={intl.formatMessage({ id: 'common.deleted' })}
          renderer={new BooleanRenderer()}
        />
      </AdminTable>

      {isDataLoaded && productTypes.length > 0 && <NewProductTypeButton />}
    </Section>
  );
};
