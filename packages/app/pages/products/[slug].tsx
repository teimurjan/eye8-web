import { GetServerSidePropsContext } from 'next';
import React from 'react';

import { Layout } from '@eye8/client/components/layout';
import { ProductTypePageContainer } from '@eye8/client/pages/product-type/container';
import { agregateOrderedMapToArray, logTimeStart, logTimeFinish } from '@eye8/shared/utils';

import { getNewDIInstance } from '../../src/new-di-instance';
import { getRequestCustomData } from '../../src/request-custom-data';

const Product = ({ productType, products, error }: Then<ReturnType<typeof getServerSideProps>>['props']) => (
  <Layout>
    <ProductTypePageContainer initialProps={{ products, productType, error }} />
  </Layout>
);

export const getServerSideProps = async ({ params = {}, req }: GetServerSidePropsContext) => {
  const { locale } = getRequestCustomData({ req });
  const {
    service: { productType: productTypeService, product: productService },
  } = getNewDIInstance({ locale });

  try {
    logTimeStart('Product.getServerSideProps');

    const productType = await productTypeService.getBySlug(params.slug as string);
    const {
      entities: { products },
      result,
    } = productType
      ? await productService.getForProductType(productType.id)
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
