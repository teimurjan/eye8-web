import React from 'react';

import { Page } from '../../components';

import AdminBannersCreate from './create';
import AdminBannersDelete from './delete';
import AdminBannersEdit from './edit';
import AdminBannersList from './list';

const AdminBanners = () => (
  <Page
    ListComponent={AdminBannersList}
    CreateComponent={AdminBannersCreate}
    EditComponent={AdminBannersEdit}
    DeleteComponent={AdminBannersDelete}
  />
);

export default AdminBanners;
