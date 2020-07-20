/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { IntlShape, injectIntl } from 'react-intl';

import { ReactRouterLinkButton } from 'src/components/admin-ui/LinkButton/LinkButton';
import { NoDataAvailable } from 'src/components/admin-ui/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/admin-ui/Section/Section';
import { AdminTable, IntlRenderer, ImageRenderer } from 'src/components/Admin/AdminTable';
import { IViewProps as IProps } from 'src/components/Admin/ProductTypes/List/AdminProductTypesListPresenter';

export const NewProductTypeButton = injectIntl(({ intl }) => (
  <ReactRouterLinkButton to="/admin/productTypes/new" color="is-primary">
    {intl.formatMessage({ id: 'AdminProductTypes.notFound.cta' })}
  </ReactRouterLinkButton>
));

const NoProductTypesAvialable = injectIntl(({ intl }) => (
  <NoDataAvailable
    title={intl.formatMessage({ id: 'AdminProductTypes.notFound.title' })}
    description={intl.formatMessage({
      id: 'AdminProductTypes.notFound.description',
    })}
    CTA={<NewProductTypeButton />}
  />
));

const renderNoData = () => <NoProductTypesAvialable />;

type ProductType = IProps['productTypes'][0];

export const AdminProductTypesListView = ({
  productTypes,
  locales,
  intl,
  isLoading,
  isDataLoaded,
  meta,
  onPageChange,
  search,
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
      renderNoData={renderNoData}
      intl={intl}
      currentPage={meta.page}
      pagesCount={meta.pages_count}
      onPageChange={onPageChange}
      search={search}
    >
      <AdminTable.Col<ProductType> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
      <AdminTable.Col<ProductType>
        key_="name"
        title={intl.formatMessage({ id: 'AdminProductTypes.names' })}
        renderer={new IntlRenderer(locales)}
      />
      <AdminTable.Col<ProductType>
        key_="image"
        title={intl.formatMessage({ id: 'AdminProductTypes.image' })}
        renderer={new ImageRenderer(productType => productType.name[intl.locale])}
      />
    </AdminTable>

    {isDataLoaded && productTypes.length > 0 && <NewProductTypeButton />}
  </Section>
);
