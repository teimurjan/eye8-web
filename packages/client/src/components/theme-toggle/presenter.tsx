import { NextRouter } from 'next/router';
import React from 'react';

import { IThemeStorage, Theme } from '@eye8/storage/theme';

export interface IProps {
  View: React.ComponentType<IViewProps>;
  themeStorage: IThemeStorage;
  router: NextRouter;
}

export interface IViewProps {
  onThemeChange: () => void;
  theme: Theme | null;
}

export const ThemeTogglePresenter: React.FC<IProps> = ({ View, themeStorage, router }) => {
  const onThemeChange = React.useCallback(() => {
    themeStorage.toggle();
    router.reload();
  }, [themeStorage, router]);

  return <View theme={themeStorage.getTheme()} onThemeChange={onThemeChange} />;
};