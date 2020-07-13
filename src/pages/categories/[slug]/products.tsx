import { GetServerSideProps } from 'next';
import * as React from 'react';

import { sortingTypeOfQueryValue, ProductTypeSortingQueryValue } from 'src/api/ProductTypeAPI';
import { Layout } from 'src/components/Client/Layout';
import { ProductTypesPageContainer } from 'src/components/Client/ProducTypesPage/ProductTypesPageContainer';
import { dependenciesFactory } from 'src/DI/DependenciesContainer';
import { paramToIDOrSlug } from 'src/utils/params';

export default ({
  productTypes,
  productTypesOrder,
  productTypesMeta,
  category,
  error,
}: Then<ReturnType<typeof getServerSideProps>>['props']) => (
  <Layout>
    <ProductTypesPageContainer initialProps={{ productTypes, productTypesOrder, productTypesMeta, category, error }} />
  </Layout>
);

export const getServerSideProps: GetServerSideProps = async ({
  params = {},
  req,
  res,
  query: { page = '1', sort_by: sortBy = ProductTypeSortingQueryValue.RECENT },
}) => {
  const dependencies = dependenciesFactory({ req, res });

  try {
    const categoryIdOrSLug = paramToIDOrSlug(params.slug as string);
    const { entities, meta, result } = await dependencies.services.productType.getForCategory(
      categoryIdOrSLug,
      parseInt(page as string, 10),
      sortingTypeOfQueryValue[sortBy as string],
    );
    const category = await dependencies.services.category.getOne(categoryIdOrSLug);

    return {
      props: {
        productTypes: entities.productTypes || {},
        productTypesMeta: meta,
        productTypesOrder: result,
        category,
      },
    };
  } catch (e) {
    return {
      props: {
        error: 'errors.common',
        productTypes: {},
        productTypesOrder: [],
        productTypesMeta: {
          count: 0,
          pages_count: 0,
          limit: 0,
          page: 0,
        },
      },
    };
  }
};
