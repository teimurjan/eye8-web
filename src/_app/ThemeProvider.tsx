import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';
import React from 'react';

import { useDependencies } from 'src/DI/DI';
import { Theme } from 'src/storage/ThemeStorage';
import { darkTheme, defaultTheme } from 'src/themes';
import featureFlags from 'src/utils/featureFlags';

interface IProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: IProps) => {
  const {
    dependencies: {
      storages: { theme: themeStorage },
    },
  } = useDependencies();

  const theme = featureFlags.shouldUseThemeToggle()
    ? themeStorage.getTheme() === Theme.Dark
      ? darkTheme
      : defaultTheme
    : defaultTheme;

  return <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>;
};
