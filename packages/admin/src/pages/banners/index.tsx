import React from 'react';

import { AdminBannersCreateContainer } from '@eye8/admin/pages/banners/create/container';
import { AdminBannersDeleteContainer } from '@eye8/admin/pages/banners/delete/container';
import { AdminBannersEditContainer } from '@eye8/admin/pages/banners/edit/container';
import { AdminBannersListContainer } from '@eye8/admin/pages/banners/list/container';

import { Page } from '../../components';

export const AdminBanners = () => (
  <Page
    ListComponent={AdminBannersListContainer}
    CreateComponent={AdminBannersCreateContainer}
    EditComponent={AdminBannersEditContainer}
    DeleteComponent={AdminBannersDeleteContainer}
  />
);
