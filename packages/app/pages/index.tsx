import { GetServerSidePropsContext } from 'next';
import React from 'react';

import { Layout } from '@eye8/client/components';
import { Home } from '@eye8/client/pages';
import { logTimeStart, logTimeFinish } from '@eye8/shared/utils';

import { getNewDIInstance } from '../src/new-di-instance';
import { getRequestCustomData } from '../src/request-custom-data';

const Index = ({
  banners,
  productTypes,
  bannersOrder,
  productTypesOrder,
  error,
}: Then<ReturnType<typeof getServerSideProps>>['props']) => {
  return (
    <Layout>
      <Home initialProps={{ banners, productTypes, bannersOrder, productTypesOrder, error }} />
    </Layout>
  );
};

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const { locale } = getRequestCustomData({ req });
  const {
    service: { banner: bannerService, productType: productTypeService },
  } = getNewDIInstance({ locale });

  try {
    logTimeStart('Index.getServerSideProps');

    const bannersPromise = bannerService.getAll();
    const productTypesPromise = productTypeService.getNewest();

    const [
      {
        entities: { banners },
        result: bannersOrder,
      },
      {
        entities: { productTypes },
        result: productTypesOrder,
      },
    ] = await Promise.all([bannersPromise, productTypesPromise]);

    return { props: { banners, bannersOrder, productTypes, productTypesOrder } };
  } catch (e) {
    console.error(e);
    return {
      props: { error: 'errors.common', banners: {}, productTypes: {}, bannersOrder: [], productTypesOrder: [] },
    };
  } finally {
    logTimeFinish('Index.getServerSideProps');
  }
};

export default Index;
