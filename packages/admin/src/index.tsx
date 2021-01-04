/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import React from 'react';
import { ArrowDown as ArrowDownIcon } from 'react-feather';
import { useIntl } from 'react-intl';
import { Route, Switch } from 'react-router';

import { Button, Section, Subtitle, Tag, Title } from '@eye8/admin-ui/index';
import { AdminMenuContainer } from '@eye8/admin/components/menu/container';
import { AdminBanners } from '@eye8/admin/pages/banners';
import { AdminCategories } from '@eye8/admin/pages/categories';
import { NewCategoryButton } from '@eye8/admin/pages/categories/list/view';
import { AdminCharacteristicValues } from '@eye8/admin/pages/characteristic-values';
import { AdminCharacteristics } from '@eye8/admin/pages/characteristics';
import { AdminFeatureTypes } from '@eye8/admin/pages/feature-types';
import { NewFeatureTypeButton } from '@eye8/admin/pages/feature-types/list/view';
import { AdminFeatureValues } from '@eye8/admin/pages/feature-values';
import { NewFeatureValueButton } from '@eye8/admin/pages/feature-values/list/view';
import { AdminOrders } from '@eye8/admin/pages/orders';
import { AdminProductTypes } from '@eye8/admin/pages/product-types';
import { NewProductTypeButton } from '@eye8/admin/pages/product-types/list/view';
import { AdminProducts } from '@eye8/admin/pages/products';
import { NewProductButton } from '@eye8/admin/pages/products/list/view';
import { AdminPromoCodes } from '@eye8/admin/pages/promo-codes';
import { AdminRates } from '@eye8/admin/pages/rates';
import { AdminBannersStateProvider } from '@eye8/admin/state/banners';
import { AdminCategoriesStateProvider } from '@eye8/admin/state/categories';
import { AdminCharacteristicValuesStateProvider } from '@eye8/admin/state/characteristic-values';
import { AdminCharacteristicsStateProvider } from '@eye8/admin/state/characteristics';
import { AdminFeatureTypesStateProvider } from '@eye8/admin/state/feature-types';
import { AdminFeatureValuesStateProvider } from '@eye8/admin/state/feature-values';
import { AdminOrdersStateProvider } from '@eye8/admin/state/orders';
import { AdminProductTypesStateProvider } from '@eye8/admin/state/product-types';
import { AdminProductsStateProvider } from '@eye8/admin/state/products';
import { AdminPromoCodesStateProvider } from '@eye8/admin/state/promo-codes';
import { AdminRatesStateProvider } from '@eye8/admin/state/rates';
import { Drawer, IconWrapper } from '@eye8/client-ui';
import { isUserSetAsManagerOrAdmin, isUserSetAsClient, isUserSetAsAdmin } from '@eye8/shared/helpers';
import { useBoolean, useMedia, useProtectedResource } from '@eye8/shared/hooks';
import { IconSize, mediaQueries } from '@eye8/shared/styles';

const arrowDivider = (
  <IconWrapper
    css={css`
      display: block;
      font-size: 20px;
      margin: 10px auto 10px auto;
      text-align: center;
    `}
  >
    <ArrowDownIcon size={IconSize.Medium} />
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
