import { useRouter } from 'next/router';
import * as React from 'react';

import { ThemeTogglePresenter } from 'src/components/client/ThemeToggle/ThemeTogglePresenter';
import { ThemeToggleView } from 'src/components/client/ThemeToggle/ThemeToggleView';
import { useDependencies } from 'src/DI/DI';

export const ThemeToggleContainer = () => {
  const {
    dependencies: {
      storages: { theme: themeStorage },
    },
  } = useDependencies();
  const router = useRouter();

  return <ThemeTogglePresenter View={ThemeToggleView} themeStorage={themeStorage} router={router} />;
};
