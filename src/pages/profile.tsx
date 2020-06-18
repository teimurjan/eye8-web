import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Layout } from 'src/components/Client/Layout';
import { Profile } from 'src/components/Client/Profile/Profile';
import { safeWindow } from 'src/utils/dom';

export default () => (
  <Layout>
    {safeWindow(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>,
      null,
    )}
  </Layout>
);
