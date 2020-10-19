import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { forceSSR } from 'src/_app/forceSSR';
import { Layout } from 'src/components/client/Layout';
import { Profile } from 'src/components/client/Profile/Profile';
import { safeWindow } from 'src/utils/dom';

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
