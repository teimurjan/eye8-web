import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';
import React from 'react';

import { useDI } from '@eye8/di';
import { darkTheme, defaultTheme } from '@eye8/shared/styles';
import { shouldUseThemeToggle, Theme } from '@eye8/shared/utils';

interface Props {
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: Props) => {
  const {
    di: {
      storage: { theme: themeStorage },
    },
  } = useDI();

  const theme = shouldUseThemeToggle()
    ? themeStorage.getTheme() === Theme.Dark
      ? darkTheme
      : defaultTheme
    : defaultTheme;

  return <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>;
};

export default ThemeProvider;
