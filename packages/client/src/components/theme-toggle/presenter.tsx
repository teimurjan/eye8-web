import { NextRouter } from 'next/router';
import React from 'react';

import { Theme } from '@eye8/shared/utils';
import { ThemeStorage } from '@eye8/storage/theme';

export interface Props {
  View: React.ComponentType<ViewProps>;
  themeStorage: ThemeStorage;
  router: NextRouter;
}

export interface ViewProps {
  onThemeChange: () => void;
  theme: Theme | null;
}

const ThemeTogglePresenter: React.FC<Props> = ({ View, themeStorage, router }) => {
  const onThemeChange = React.useCallback(() => {
    themeStorage.toggle();
    router.reload();
  }, [themeStorage, router]);

  return <View theme={themeStorage.getTheme()} onThemeChange={onThemeChange} />;
};

export default ThemeTogglePresenter;
