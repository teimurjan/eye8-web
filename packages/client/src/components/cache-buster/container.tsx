import React from 'react';

import { useDI } from '@eye8/di';

import CacheBusterPresenter from './presenter';
import CacheBusterView from './view';

const CacheBusterContainer = () => {
  const {
    di: {
      storage: { version: versionStorage },
    },
  } = useDI();

  return <CacheBusterPresenter versionStorage={versionStorage} View={CacheBusterView} />;
};

export default CacheBusterContainer;
