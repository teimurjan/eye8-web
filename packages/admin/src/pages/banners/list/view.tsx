/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { LinkButton, NoDataAvailable, Section } from '@eye8/admin-ui';

import { Table, ImageRenderer } from '../../../components';

import { ViewProps as Props } from './presenter';


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

const AdminBannersListView = ({ banners, isLoading, isDataLoaded }: Props) => {
  const intl = useIntl();
  return (
    <Section
      css={css`
        width: 100%;
      `}
    >
      <Table<Banner>
        hideSubheader={true}
        pathPrefix="/admin/banners"
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        entities={banners}
        renderNoData={renderNoData}
      >
        <Table.Col<Banner> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <Table.Col<Banner>
          key_="link"
          title={intl.formatMessage({
            id: 'AdminBanners.link',
          })}
        />
        <Table.Col<Banner>
          key_="image"
          title={intl.formatMessage({
            id: 'AdminBanners.image',
          })}
          renderer={new ImageRenderer((banner) => `Banner #${banner.id}`)}
        />
      </Table>

      {isDataLoaded && banners.length > 0 && <NewBannerButton />}
    </Section>
  );
};

export default AdminBannersListView;
