import { useRouter } from 'next/router';
import React from 'react';

import { ThemeTogglePresenter } from '@eye8/client/components/theme-toggle/presenter';
import { ThemeToggleView } from '@eye8/client/components/theme-toggle/view';
import { useDI } from '@eye8/di';

export const ThemeToggleContainer = () => {
  const {
    di: {
      storage: { theme: themeStorage },
    },
  } = useDI();
  const router = useRouter();

  return <ThemeTogglePresenter View={ThemeToggleView} themeStorage={themeStorage} router={router} />;
};
