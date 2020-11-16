import { GetServerSidePropsContext } from 'next';
import * as React from 'react';

import { HomeContainer } from 'src/components/client/Home/HomeContainer';
import { Layout } from 'src/components/client/Layout';
import { dependenciesFactory } from 'src/DI/DependenciesContainer';
import { logTimeStart, logTimeFinish } from 'src/utils/log';

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

    logTimeFinish('Index.getServerSideProps');

    return { props: { banners, bannersOrder, productTypes, productTypesOrder } };
  } catch (e) {
    console.error(e);
    return {
      props: { error: 'errors.common', banners: {}, productTypes: {}, bannersOrder: [], productTypesOrder: [] },
    };
  }
};

export default Index;
