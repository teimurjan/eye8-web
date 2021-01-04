import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Admin } from '@eye8/admin/index';
import { safeWindow } from '@eye8/shared/utils';

import { forceSSR } from '../src/force-ssr';

const Admin_ = () =>
  safeWindow(
    <BrowserRouter>
      <Admin />
    </BrowserRouter>,
    null,
  );

export { forceSSR as getServerSideProps, Admin_ as default };
