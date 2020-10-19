/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import * as React from 'react';
import { ArrowDown as ArrowDownIcon } from 'react-feather';
import { useIntl } from 'react-intl';
import { Route, Switch } from 'react-router';

import { Button } from 'src/components/admin-ui/Button/Button';
import { Section } from 'src/components/admin-ui/Section/Section';
import { Subtitle } from 'src/components/admin-ui/Subtitle/Subtitle';
import { Tag } from 'src/components/admin-ui/Tag/Tag';
import { Title } from 'src/components/admin-ui/Title/Title';
import { AdminMenuContainer } from 'src/components/admin/layout/Menu/AdminMenuContainer';
import { AdminBanners } from 'src/components/admin/pages/Banners/AdminBanners';
import { AdminCategories } from 'src/components/admin/pages/Categories/AdminCategories';
import { NewCategoryButton } from 'src/components/admin/pages/Categories/List/AdminCategoriesListView';
import { AdminCharacteristics } from 'src/components/admin/pages/Characteristics/AdminCharacteristics';
import { AdminCharacteristicValues } from 'src/components/admin/pages/CharacteristicValues/AdminCharacteristicValues';
import { AdminFeatureTypes } from 'src/components/admin/pages/FeatureTypes/AdminFeatureTypes';
import { NewFeatureTypeButton } from 'src/components/admin/pages/FeatureTypes/List/AdminFeatureTypesListView';
import { AdminFeatureValues } from 'src/components/admin/pages/FeatureValues/AdminFeatureValues';
import { NewFeatureValueButton } from 'src/components/admin/pages/FeatureValues/List/AdminFeatureValuesListView';
import { AdminOrders } from 'src/components/admin/pages/Orders/AdminOrders';
import { AdminProducts } from 'src/components/admin/pages/Products/AdminProducts';
import { NewProductButton } from 'src/components/admin/pages/Products/List/AdminProductsListView';
import { AdminProductTypes } from 'src/components/admin/pages/ProductTypes/AdminProductTypes';
import { NewProductTypeButton } from 'src/components/admin/pages/ProductTypes/List/AdminProductTypesListView';
import { AdminPromoCodes } from 'src/components/admin/pages/PromoCodes/AdminPromoCodes';
import { AdminRates } from 'src/components/admin/pages/Rates/AdminRates';
import { Drawer } from 'src/components/client-ui/Drawer/Drawer';
import { IconWrapper } from 'src/components/client-ui/IconWrapper/IconWrapper';
import { isUserSetAsManagerOrAdmin, isUserSetAsClient, isUserSetAsAdmin } from 'src/helpers/user';
import { useBoolean } from 'src/hooks/useBoolean';
import { useMedia } from 'src/hooks/useMedia';
import { useProtectedResource } from 'src/hooks/useProtectedResource';
import { AdminBannersStateProvider } from 'src/state/Admin/AdminBannersState';
import { AdminCategoriesStateProvider } from 'src/state/Admin/AdminCategoriesState';
import { AdminCharacteristicsStateProvider } from 'src/state/Admin/AdminCharacteristicsState';
import { AdminCharacteristicValuesStateProvider } from 'src/state/Admin/AdminCharacteristicValuesState';
import { AdminFeatureTypesStateProvider } from 'src/state/Admin/AdminFeatureTypesState';
import { AdminFeatureValuesStateProvider } from 'src/state/Admin/AdminFeatureValuesState';
import { AdminOrdersStateProvider } from 'src/state/Admin/AdminOrdersState';
import { AdminProductsStateProvider } from 'src/state/Admin/AdminProductsState';
import { AdminProductTypesStateProvider } from 'src/state/Admin/AdminProductTypesState';
import { AdminPromoCodesStateProvider } from 'src/state/Admin/AdminPromoCodesState';
import { AdminRatesStateProvider } from 'src/state/Admin/AdminRatesState';
import { IconSizes } from 'src/styles/icon';
import { mediaQueries } from 'src/styles/media';

const arrowDivider = (
  <IconWrapper
    css={css`
      display: block;
      font-size: 20px;
      margin: 10px auto 10px auto;
      text-align: center;
    `}
  >
    <ArrowDownIcon size={IconSizes.Medium} />
  </IconWrapper>
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
        <AdminCharacteristicsStateProvider>
          <AdminCharacteristicValuesStateProvider>
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
          </AdminCharacteristicValuesStateProvider>
        </AdminCharacteristicsStateProvider>
      </AdminCategoriesStateProvider>
    </AdminBannersStateProvider>
  ) : null;
};
