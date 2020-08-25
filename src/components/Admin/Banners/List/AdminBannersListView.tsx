/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { IntlShape, injectIntl } from 'react-intl';

import { ReactRouterLinkButton } from 'src/components/admin-ui/LinkButton/LinkButton';
import { NoDataAvailable } from 'src/components/admin-ui/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/admin-ui/Section/Section';
import { AdminTable, ImageRenderer } from 'src/components/Admin/AdminTable';
import { IViewProps as IProps } from 'src/components/Admin/Banners/List/AdminBannersListPresenter';

export const NewBannerButton = injectIntl(({ intl }) => (
  <ReactRouterLinkButton to="/admin/banners/new" color="is-primary">
    {intl.formatMessage({ id: 'AdminBanners.notFound.cta' })}
  </ReactRouterLinkButton>
));

const NoBannersAvialable = injectIntl(({ intl }) => (
  <NoDataAvailable
    title={intl.formatMessage({ id: 'AdminBanners.notFound.title' })}
    description={intl.formatMessage({
      id: 'AdminBanners.notFound.description',
    })}
    CTA={<NewBannerButton />}
  />
));

const renderNoData = () => <NoBannersAvialable />;

type Banner = IProps['banners'][0];

export const AdminBannersListView = ({ banners, intl, isLoading, isDataLoaded }: IProps & { intl: IntlShape }) => (
  <Section
    css={css`
      width: 100%;
    `}
  >
    <AdminTable<Banner>
      hideSubheader={true}
      pathPrefix="/admin/banners"
      isLoading={isLoading}
      isDataLoaded={isDataLoaded}
      entities={banners}
      renderNoData={renderNoData}
      intl={intl}
    >
      <AdminTable.Col<Banner> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
      <AdminTable.Col<Banner>
        key_="link"
        title={intl.formatMessage({
          id: 'AdminBanners.link',
        })}
      />
      <AdminTable.Col<Banner>
        key_="image"
        title={intl.formatMessage({
          id: 'AdminBanners.image',
        })}
        renderer={new ImageRenderer((banner) => `Banner #${banner.id}`)}
      />
    </AdminTable>

    {isDataLoaded && banners.length > 0 && <NewBannerButton />}
  </Section>
);
