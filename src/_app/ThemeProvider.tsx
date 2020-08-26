import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';
import React from 'react';

import { useDependencies } from 'src/DI/DI';
import { Theme } from 'src/storage/ThemeStorage';
import { darkTheme, defaultTheme } from 'src/themes';

interface IProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: IProps) => {
  const {
    dependencies: {
      storages: { theme: themeStorage },
    },
  } = useDependencies();

  const theme = themeStorage.getTheme() === Theme.Dark ? darkTheme : defaultTheme;

  return <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>;
};
