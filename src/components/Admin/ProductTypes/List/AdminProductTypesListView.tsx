/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { Checkbox } from 'src/components/admin-ui/Checkbox/Checkbox';
import { NoDataAvailable } from 'src/components/admin-ui/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/admin-ui/Section/Section';
import { AdminFiltersSection } from 'src/components/Admin/AdminFiltersSection';
import {
  AdminTable,
  IntlRenderer,
  ImageRenderer,
  LinkRenderer,
  BooleanRenderer,
} from 'src/components/Admin/AdminTable';
import { NewButton } from 'src/components/Admin/NewButton';
import { IViewProps as IProps } from 'src/components/Admin/ProductTypes/List/AdminProductTypesListPresenter';

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

type ProductType = IProps['productTypes'][0];

export const AdminProductTypesListView = ({
  productTypes,
  isLoading,
  isDataLoaded,
  meta,
  onPageChange,
  onDeletedModeChange,
  search,
  isDeletedMode,
}: IProps) => {
  const intl = useIntl();
  return (
    <Section
      css={css`
        width: 100%;
      `}
    >
      <AdminFiltersSection>
        <Checkbox
          label={intl.formatMessage({ id: 'common.isDeletedMode' })}
          onChange={onDeletedModeChange}
          checked={isDeletedMode}
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
        search={search}
        isDeletedMode={isDeletedMode}
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
