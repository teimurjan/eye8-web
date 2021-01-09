import { GetServerSidePropsContext } from 'next';
import React from 'react';

import { Layout } from '@eye8/client/components/layout';
import { HomeContainer } from '@eye8/client/pages/home/container';
import { dependenciesFactory } from '@eye8/di';
import { logTimeStart, logTimeFinish } from '@eye8/shared/utils';

const Index = ({
  banners,
  productTypes,
  bannersOrder,
  productTypesOrder,
  error,
}: Then<ReturnType<typeof getServerSideProps>>['props']) => {
  return (
    <Layout>
      <HomeContainer initialProps={{ banners, productTypes, bannersOrder, productTypesOrder, error }} />
    </Layout>
  );
};

export const getServerSideProps = async ({ req, res }: GetServerSidePropsContext) => {
  const {
    services: { banner: bannerService, productType: productTypeService },
  } = dependenciesFactory({ req, res });

  try {
    logTimeStart('ndex.getServerSideProps');

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

    logTimeFinish('ndex.getServerSideProps');

    return { props: { banners, bannersOrder, productTypes, productTypesOrder } };
  } catch (e) {
    console.error(e);
    return {
      props: { error: 'errors.common', banners: {}, productTypes: {}, bannersOrder: [], productTypesOrder: [] },
    };
  }
};

export default Index;
