import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Layout } from '@eye8/client/components';
import { Profile } from '@eye8/client/pages';
import { safeWindow } from '@eye8/shared/utils';

import forceSSR from '../src/force-ssr';

const Profile_ = () => (
  <Layout>
    {safeWindow(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>,
      null,
    )}
  </Layout>
);

export { forceSSR as getServerSideProps, Profile_ as default };
