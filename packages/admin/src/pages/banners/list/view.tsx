/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { LinkButton, NoDataAvailable, Section } from '@eye8/admin-ui';
import { AdminTable, ImageRenderer } from '@eye8/admin/components/table';
import { ViewProps as Props } from '@eye8/admin/pages/banners/list/presenter';

export const NewBannerButton = () => {
  const intl = useIntl();
  return (
    <LinkButton to="/admin/banners/new" color="is-primary">
      {intl.formatMessage({ id: 'AdminBanners.notFound.cta' })}
    </LinkButton>
  );
};

const NoBannersAvialable = () => {
  const intl = useIntl();
  return (
    <NoDataAvailable
      title={intl.formatMessage({ id: 'AdminBanners.notFound.title' })}
      description={intl.formatMessage({
        id: 'AdminBanners.notFound.description',
      })}
      CTA={<NewBannerButton />}
    />
  );
};

const renderNoData = () => <NoBannersAvialable />;

type Banner = Props['banners'][0];

export const AdminBannersListView = ({ banners, isLoading, isDataLoaded }: Props) => {
  const intl = useIntl();
  return (
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
};
