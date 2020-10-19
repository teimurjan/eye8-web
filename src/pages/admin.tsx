import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { forceSSR } from 'src/_app/forceSSR';
import { Admin } from 'src/components/admin/Admin';
import { safeWindow } from 'src/utils/dom';

const Admin_ = () =>
  safeWindow(
    <BrowserRouter>
      <Admin />
    </BrowserRouter>,
    null,
  );

export { forceSSR as getServerSideProps, Admin_ as default };
