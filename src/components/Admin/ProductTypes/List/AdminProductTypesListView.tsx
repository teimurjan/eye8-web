/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { IntlShape, useIntl } from 'react-intl';

import { NoDataAvailable } from 'src/components/admin-ui/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/admin-ui/Section/Section';
import { AdminButtonsGroup } from 'src/components/Admin/AdminButtonsGroup';
import {
  AdminTable,
  IntlRenderer,
  ImageRenderer,
  LinkRenderer,
  BooleanRenderer,
} from 'src/components/Admin/AdminTable';
import { DeletedButton } from 'src/components/Admin/DeletedButton';
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

const NoProductTypesAvialable = ({ showDeleted }: Pick<IProps, 'showDeleted'>) => {
  const intl = useIntl();
  return (
    <NoDataAvailable
      title={intl.formatMessage({ id: 'AdminProductTypes.notFound.title' })}
      description={intl.formatMessage({
        id: 'AdminProductTypes.notFound.description',
      })}
      CTA={
        showDeleted ? (
          <DeletedButton state={DeletedButton.State.Active} pathPrefix="/admin/productTypes" />
        ) : (
          <NewProductTypeButton />
        )
      }
    />
  );
};

type ProductType = IProps['productTypes'][0];

export const AdminProductTypesListView = ({
  productTypes,
  intl,
  isLoading,
  isDataLoaded,
  meta,
  onPageChange,
  search,
  showDeleted,
}: IProps & { intl: IntlShape }) => (
  <Section
    css={css`
      width: 100%;
    `}
  >
    <AdminTable<ProductType>
      pathPrefix="/admin/productTypes"
      isLoading={isLoading}
      isDataLoaded={isDataLoaded}
      entities={productTypes}
      renderNoData={() => <NoProductTypesAvialable showDeleted={showDeleted} />}
      intl={intl}
      currentPage={meta?.page}
      pagesCount={meta?.pages_count}
      onPageChange={onPageChange}
      search={search}
      showDeleted={showDeleted}
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

    {isDataLoaded && productTypes.length > 0 && (
      <AdminButtonsGroup>
        <NewProductTypeButton />
        <DeletedButton
          state={showDeleted ? DeletedButton.State.Active : DeletedButton.State.Idle}
          pathPrefix="/admin/productTypes"
        />
      </AdminButtonsGroup>
    )}
  </Section>
);
