import { GetServerSidePropsContext } from 'next';
import React from 'react';

import { Layout } from '@eye8/client/components/layout';
import { ProductTypePageContainer } from '@eye8/client/pages/product-type/container';
import { dependenciesFactory } from '@eye8/di';
import { agregateOrderedMapToArray, logTimeStart, logTimeFinish } from '@eye8/shared/utils';

const Product = ({ productType, products, error }: Then<ReturnType<typeof getServerSideProps>>['props']) => (
  <Layout>
    <ProductTypePageContainer initialProps={{ products, productType, error }} />
  </Layout>
);

export const getServerSideProps = async ({ params = {}, req, res }: GetServerSidePropsContext) => {
  const dependencies = dependenciesFactory({ req, res });

  try {
    logTimeStart('Product.getServerSideProps');

    const productType = await dependencies.services.productType.getBySlug(params.slug as string);
    const {
      entities: { products },
      result,
    } = productType
      ? await dependencies.services.product.getForProductType(productType.id)
      : { entities: { products: {} }, result: [] };

    logTimeFinish('Product.getServerSideProps');

    return {
      props: {
        productType,
        products: agregateOrderedMapToArray(products, result),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        error: 'errors.common',
        productType: null,
        products: [],
      },
    };
  }
};

export default Product;
