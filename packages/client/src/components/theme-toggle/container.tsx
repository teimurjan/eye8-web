import { useRouter } from 'next/router';
import React from 'react';

import { useDI } from '@eye8/di';

import ThemeTogglePresenter from './presenter';
import ThemeToggleView from './view';

const ThemeToggleContainer = () => {
  const {
    di: {
      storage: { theme: themeStorage },
    },
  } = useDI();
  const router = useRouter();

  return <ThemeTogglePresenter View={ThemeToggleView} themeStorage={themeStorage} router={router} />;
};

export default ThemeToggleContainer;
