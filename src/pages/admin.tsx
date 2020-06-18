import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Admin } from 'src/components/Admin/Admin';
import { safeWindow } from 'src/utils/dom';

export default () =>
  safeWindow(
    <BrowserRouter>
      <Admin />
    </BrowserRouter>,
    null,
  );
