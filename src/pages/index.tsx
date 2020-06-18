import { GetServerSideProps } from 'next';
import * as React from 'react';

import { HomeContainer } from 'src/components/Client/Home/HomeContainer';
import { Layout } from 'src/components/Client/Layout';
import { dependenciesFactory } from 'src/DI/DependenciesContainer';

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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const dependencies = dependenciesFactory({ req, res });

  try {
    const {
      entities: { banners },
      result: bannersOrder,
    } = await dependencies.services.banner.getAll();

    const {
      entities: { productTypes },
      result: productTypesOrder,
    } = await dependencies.services.productType.getNewest();

    return { props: { banners, bannersOrder, productTypes, productTypesOrder } };
  } catch (e) {
    return {
      props: { error: 'errors.common', banners: {}, productTypes: {}, bannersOrder: [], productTypesOrder: [] },
    };
  }
};

export default Index;
