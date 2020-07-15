import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { forceSSR } from 'src/_app/forceSSR';
import { Admin } from 'src/components/Admin/Admin';
import { safeWindow } from 'src/utils/dom';

export default () =>
  safeWindow(
    <BrowserRouter>
      <Admin />
    </BrowserRouter>,
    null,
  );

export { forceSSR as getServerSideProps };
