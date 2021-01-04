import url from 'url';

import { GetServerSidePropsContext } from 'next';
import React from 'react';

import { sortingTypeOfQueryValue, ProductTypeSortingQueryValue } from '@eye8/api/product-type';
import { Layout } from '@eye8/client/components/layout';
import { ProductTypesPageContainer } from '@eye8/client/pages/product-types/container';
import { getCharacteristicValuesIdsFromQuery } from '@eye8/client/pages/product-types/presenter';
import { dependenciesFactory } from '@eye8/di';
import { logTimeStart, logTimeFinish } from '@eye8/shared/utils';

const Products = ({
  productTypes,
  productTypesOrder,
  productTypesMeta,
  category,
  error,
  categorySlug,
  page,
  sortingType,
  characteristicValuesIds,
}: Then<ReturnType<typeof getServerSideProps>>['props']) => (
  <Layout>
    <ProductTypesPageContainer
      initialProps={{
        productTypes,
        productTypesOrder,
        productTypesMeta,
        category,
        error,
        categorySlug,
        page,
        sortingType,
        characteristicValuesIds,
      }}
    />
  </Layout>
);

export const getServerSideProps = async ({ params = {}, req, res }: GetServerSidePropsContext) => {
  const parsedUrl = url.parse(req.url ?? '', true);
  const { page = '1', sort_by: sortBy = ProductTypeSortingQueryValue.RECENT } = parsedUrl.query;

  const dependencies = dependenciesFactory({ req, res });

  try {
    logTimeStart('CategoryProducts.getServerSideProps');

    const categorySlug = params.slug as string;
    const options = {
      page: parseInt(page as string, 10),
      sortingType: sortingTypeOfQueryValue[sortBy as string],
      characteristicValuesIds: getCharacteristicValuesIdsFromQuery(parsedUrl.query),
    };
    const { entities, meta, result } = await dependencies.services.productType.getForCategory(categorySlug, options);
    const category = await dependencies.services.category.getOneBySlug(categorySlug);

    logTimeFinish('CategoryProducts.getServerSideProps');

    return {
      props: {
        productTypes: entities.productTypes || {},
        productTypesMeta: meta,
        productTypesOrder: result,
        category,
        categorySlug,
        ...options,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        error: 'errors.common',
        productTypes: {},
        productTypesOrder: [],
        categorySlug: undefined,
        category: undefined,
        page: 1,
        sortingType: undefined,
        characteristicValuesIds: [],
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

export default Products;
