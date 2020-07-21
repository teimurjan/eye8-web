import { GetServerSideProps } from 'next';
import * as React from 'react';

import { Layout } from 'src/components/Client/Layout';
import { ProductTypePageContainer } from 'src/components/Client/ProductTypePage/ProductTypePageContainer';
import { dependenciesFactory } from 'src/DI/DependenciesContainer';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export default ({ productType, products, error }: Then<ReturnType<typeof getServerSideProps>>['props']) => (
  <Layout>
    <ProductTypePageContainer initialProps={{ products, productType, error }} />
  </Layout>
);

export const getServerSideProps: GetServerSideProps = async ({ params = {}, req, res }) => {
  const dependencies = dependenciesFactory({ req, res });

  try {
    const productType = await dependencies.services.productType.getBySlug(params.slug as string);
    const {
      entities: { products },
      result,
    } = productType
      ? await dependencies.services.product.getForProductType(productType.id)
      : { entities: { products: {} }, result: [] };

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
