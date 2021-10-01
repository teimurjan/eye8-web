import { css } from '@emotion/react';
import { Layout } from 'antd';
import { Route, Switch } from 'react-router';
import { Redirect } from 'react-router-dom';

import { isUserSetAsManagerOrAdmin, isUserSetAsClient, isUserSetAsAdmin } from '@eye8/shared/helpers';
import { useProtectedResource } from '@eye8/shared/hooks';
import { mediaQueries } from '@eye8/shared/styles';

import { ResponsiveMenu } from './components';
import {
  AdminBanners,
  AdminCategories,
  AdminCharacteristicValues,
  AdminCharacteristics,
  AdminFeatureTypes,
  AdminFeatureValues,
  AdminOrders,
  AdminProductTypes,
  AdminProducts,
  AdminPromoCodes,
  AdminRates,
} from './pages';
import {
  AdminBannersStateProvider,
  AdminCategoriesStateProvider,
  AdminCharacteristicValuesStateProvider,
  AdminCharacteristicsStateProvider,
  AdminFeatureTypesStateProvider,
  AdminFeatureValuesStateProvider,
  AdminOrdersStateProvider,
  AdminProductTypesStateProvider,
  AdminProductsStateProvider,
  AdminPromoCodesStateProvider,
  AdminRatesStateProvider,
} from './state';

const Admin = () => {
  const shouldShowAdmin = useProtectedResource(isUserSetAsManagerOrAdmin, isUserSetAsClient);
  const shouldShowFullAdmin = useProtectedResource(isUserSetAsAdmin);

  return shouldShowAdmin ? (
    <AdminBannersStateProvider>
      <AdminCategoriesStateProvider>
        <AdminCharacteristicsStateProvider>
          <AdminCharacteristicValuesStateProvider>
            <AdminFeatureTypesStateProvider>
              <AdminFeatureValuesStateProvider>
                <AdminProductTypesStateProvider>
                  <AdminProductsStateProvider>
                    <AdminOrdersStateProvider>
                      <AdminPromoCodesStateProvider>
                        <AdminRatesStateProvider>
                          <Layout>
                            <ResponsiveMenu />
                            <Layout.Content
                              css={css`
                                padding: 2rem 2rem 1rem 2rem;
                                min-height: 100vh;

                                @media ${mediaQueries.maxWidth768} {
                                  padding: 4rem 1rem 1rem 1rem;
                                }
                              `}
                            >
                              <Switch>
                                <Route path="/admin/categories" component={AdminCategories} />
                                <Route path="/admin/characteristics" component={AdminCharacteristics} />
                                <Route path="/admin/characteristicValues" component={AdminCharacteristicValues} />
                                <Route path="/admin/featureTypes" component={AdminFeatureTypes} />
                                <Route path="/admin/featureValues" component={AdminFeatureValues} />
                                <Route path="/admin/productTypes" component={AdminProductTypes} />
                                <Route path="/admin/products" component={AdminProducts} />
                                <Route path="/admin/banners" component={AdminBanners} />
                                <Route path="/admin/orders" component={AdminOrders} />
                                <Route path="/admin/promoCodes" component={AdminPromoCodes} />
                                <Route path="/admin/rates" component={shouldShowFullAdmin ? AdminRates : () => null} />
                                <Route>
                                  <Redirect to="/admin/categories" />
                                </Route>
                              </Switch>
                            </Layout.Content>
                          </Layout>
                        </AdminRatesStateProvider>
                      </AdminPromoCodesStateProvider>
                    </AdminOrdersStateProvider>
                  </AdminProductsStateProvider>
                </AdminProductTypesStateProvider>
              </AdminFeatureValuesStateProvider>
            </AdminFeatureTypesStateProvider>
          </AdminCharacteristicValuesStateProvider>
        </AdminCharacteristicsStateProvider>
      </AdminCategoriesStateProvider>
    </AdminBannersStateProvider>
  ) : null;
};

export default Admin;
