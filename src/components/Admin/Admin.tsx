/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from 'emotion-theming';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { Route, Switch } from 'react-router';

import { Button } from 'src/components/admin-ui/Button/Button';
import { Section } from 'src/components/admin-ui/Section/Section';
import { Subtitle } from 'src/components/admin-ui/Subtitle/Subtitle';
import { Tag } from 'src/components/admin-ui/Tag/Tag';
import { Title } from 'src/components/admin-ui/Title/Title';
import { AdminBanners } from 'src/components/Admin/Banners/AdminBanners';
import { AdminCategories } from 'src/components/Admin/Categories/AdminCategories';
import { NewCategoryButton } from 'src/components/Admin/Categories/List/AdminCategoriesListView';
import { AdminFeatureTypes } from 'src/components/Admin/FeatureTypes/AdminFeatureTypes';
import { NewFeatureTypeButton } from 'src/components/Admin/FeatureTypes/List/AdminFeatureTypesListView';
import { AdminFeatureValues } from 'src/components/Admin/FeatureValues/AdminFeatureValues';
import { NewFeatureValueButton } from 'src/components/Admin/FeatureValues/List/AdminFeatureValuesListView';
import { AdminMenuContainer } from 'src/components/Admin/Menu/AdminMenuContainer';
import { AdminOrders } from 'src/components/Admin/Orders/AdminOrders';
import { AdminProducts } from 'src/components/Admin/Products/AdminProducts';
import { NewProductButton } from 'src/components/Admin/Products/List/AdminProductsListView';
import { AdminProductTypes } from 'src/components/Admin/ProductTypes/AdminProductTypes';
import { NewProductTypeButton } from 'src/components/Admin/ProductTypes/List/AdminProductTypesListView';
import { AdminPromoCodes } from 'src/components/Admin/PromoCodes/AdminPromoCodes';
import { AdminRates } from 'src/components/Admin/Rates/AdminRates';
import { Drawer } from 'src/components/client-ui/Drawer/Drawer';
import { isUserSetAsManagerOrAdmin, isUserSetAsClient, isUserSetAsAdmin } from 'src/helpers/user';
import { useBoolean } from 'src/hooks/useBoolean';
import { useMedia } from 'src/hooks/useMedia';
import { useProtectedResource } from 'src/hooks/useProtectedResource';
import { AdminBannersStateProvider } from 'src/state/AdminBannersState';
import { AdminCategoriesStateProvider } from 'src/state/AdminCategoriesState';
import { AdminFeatureTypesStateProvider } from 'src/state/AdminFeatureTypesState';
import { AdminFeatureValuesStateProvider } from 'src/state/AdminFeatureValuesState';
import { AdminOrdersStateProvider } from 'src/state/AdminOrdersState';
import { AdminProductsStateProvider } from 'src/state/AdminProductsState';
import { AdminProductTypesStateProvider } from 'src/state/AdminProductTypesState';
import { AdminPromoCodesStateProvider } from 'src/state/AdminPromoCodesState';
import { AdminRatesStateProvider } from 'src/state/AdminRatesState';
import { mediaQueries } from 'src/styles/media';

const arrowDivider = (
  <FontAwesomeIcon
    css={css`
      display: block;
      font-size: 20px;
      margin: 10px auto 10px auto;
    `}
    icon={faArrowDown}
  />
);

interface IStepProps {
  subtitle: React.ReactNode;
  button_: React.ReactNode;
}

const Step = ({ button_, subtitle }: IStepProps) => (
  <div
    css={css`
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 0;
    `}
  >
    <Subtitle
      size={5}
      css={css`
        padding-bottom: 10px;
      `}
    >
      {subtitle}
    </Subtitle>
    {button_}
  </div>
);

const AdminHome = () => {
  const intl = useIntl();

  return (
    <Section>
      <div
        css={css`
          padding-bottom: 40px;
          text-align: center;
          width: 1000px;
          max-width: 100%;
          margin: auto;
        `}
      >
        <Title size={1}>{intl.formatMessage({ id: 'AdminHome.title' })}</Title>
        <br />
        <Title size={2}>{intl.formatMessage({ id: 'AdminHome.description' })}</Title>
      </div>
      <Step
        subtitle={
          <React.Fragment>
            {intl.formatMessage({ id: 'AdminHome.makeCategory' })} {intl.formatMessage({ id: 'common.example' })}{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleCategory' })}</Tag>.
          </React.Fragment>
        }
        button_={<NewCategoryButton />}
      />
      {arrowDivider}
      <Step
        subtitle={
          <React.Fragment>
            {intl.formatMessage({ id: 'AdminHome.makeFeatureType' })} {intl.formatMessage({ id: 'common.example' })}{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleFeatureType1' })}</Tag>,{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleFeatureType2' })}</Tag>.
          </React.Fragment>
        }
        button_={<NewFeatureTypeButton />}
      />
      {arrowDivider}
      <Step
        subtitle={
          <React.Fragment>
            {intl.formatMessage({ id: 'AdminHome.makeFeatureValue' })} {intl.formatMessage({ id: 'common.example' })}{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleFeatureValue1' })}</Tag>,{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleFeatureValue2' })}</Tag>,{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleFeatureValue3' })}</Tag>,{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleFeatureValue4' })}</Tag>.
          </React.Fragment>
        }
        button_={<NewFeatureValueButton />}
      />
      {arrowDivider}
      <Step
        subtitle={
          <React.Fragment>
            {intl.formatMessage({ id: 'AdminHome.makeProductType' })} {intl.formatMessage({ id: 'common.example' })}{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleProductType1' })}</Tag>,{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleProductType2' })}</Tag>.
          </React.Fragment>
        }
        button_={<NewProductTypeButton />}
      />
      {arrowDivider}
      <Step
        subtitle={
          <React.Fragment>
            {intl.formatMessage({ id: 'AdminHome.makeProduct' })} {intl.formatMessage({ id: 'common.example' })}{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleProduct1' })}</Tag>,{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleProduct2' })}</Tag>.
          </React.Fragment>
        }
        button_={<NewProductButton />}
      />
    </Section>
  );
};

const Menu = () => {
  const theme = useTheme<AdminUITheme>();
  const intl = useIntl();

  const isMobile = useMedia([mediaQueries.maxWidth768], [true], false);
  const { value: isOpen, setPositive: openMobileMenu, setNegative: closeMobileMenu } = useBoolean();

  const menu = <AdminMenuContainer />;

  return isMobile ? (
    <>
      <Button
        css={css`
          position: fixed;
          top: 10px;
          left: 1.5rem;
        `}
        color="is-info"
        onClick={openMobileMenu}
      >
        {intl.formatMessage({ id: 'common.menu' })}
      </Button>
      <Drawer isOpen={isOpen} close={closeMobileMenu} fromSide="left" fixed backdrop>
        <div
          css={css`
            background: ${theme.white};
            height: 100%;
          `}
        >
          {menu}
        </div>
      </Drawer>
    </>
  ) : (
    <div
      css={css`
        flex: 0 0 350px;
      `}
    >
      {menu}
    </div>
  );
};

export const Admin = () => {
  const shouldShowAdmin = useProtectedResource(isUserSetAsManagerOrAdmin, isUserSetAsClient);
  const shouldShowFullAdmin = useProtectedResource(isUserSetAsAdmin);

  return shouldShowAdmin ? (
    <AdminBannersStateProvider>
      <AdminCategoriesStateProvider>
        <AdminFeatureTypesStateProvider>
          <AdminFeatureValuesStateProvider>
            <AdminProductTypesStateProvider>
              <AdminProductsStateProvider>
                <AdminOrdersStateProvider>
                  <AdminPromoCodesStateProvider>
                    <AdminRatesStateProvider>
                      <div
                        css={css`
                          align-items: flex-start;
                          display: flex;
                        `}
                      >
                        <Menu />
                        <div
                          css={css`
                            width: calc(100% - 350px);

                            @media ${mediaQueries.maxWidth768} {
                              width: 100%;
                            }
                          `}
                        >
                          <Switch>
                            <Route path="/admin/categories" component={AdminCategories} />
                            <Route path="/admin/featureTypes" component={AdminFeatureTypes} />
                            <Route path="/admin/featureValues" component={AdminFeatureValues} />
                            <Route path="/admin/productTypes" component={AdminProductTypes} />
                            <Route path="/admin/products" component={AdminProducts} />
                            <Route path="/admin/banners" component={AdminBanners} />
                            <Route path="/admin/orders" component={AdminOrders} />
                            <Route path="/admin/promoCodes" component={AdminPromoCodes} />
                            <Route path="/admin/rates" component={shouldShowFullAdmin ? AdminRates : () => null} />
                            <Route component={AdminHome} />
                          </Switch>
                        </div>
                      </div>
                    </AdminRatesStateProvider>
                  </AdminPromoCodesStateProvider>
                </AdminOrdersStateProvider>
              </AdminProductsStateProvider>
            </AdminProductTypesStateProvider>
          </AdminFeatureValuesStateProvider>
        </AdminFeatureTypesStateProvider>
      </AdminCategoriesStateProvider>
    </AdminBannersStateProvider>
  ) : null;
};
