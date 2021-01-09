import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';
import React from 'react';

import { useDependencies } from '@eye8/di';
import { darkTheme, defaultTheme } from '@eye8/shared/styles';
import { shouldUseThemeToggle } from '@eye8/shared/utils';
import { Theme } from '@eye8/storage/theme';

interface Props {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  const {
    dependencies: {
      storages: { theme: themeStorage },
    },
  } = useDependencies();

  const theme = shouldUseThemeToggle()
    ? themeStorage.getTheme() === Theme.Dark
      ? darkTheme
      : defaultTheme
    : defaultTheme;

  return <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>;
};
