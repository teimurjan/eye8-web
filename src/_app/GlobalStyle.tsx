import { Global, css } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import { useRouter } from 'next/router';
import * as React from 'react';

const FONT_FAMILY = 'Jost';
export const GlobalStyles = () => {
  const theme = useTheme<ClientUITheme>();

  const isAdmin = useRouter().pathname.includes('admin');

  React.useEffect(() => {
    isAdmin ? document.documentElement.classList.add('admin') : document.documentElement.classList.remove('admin');
  }, [isAdmin]);

  return (
    <Global
      styles={css`
      html {
        overflow: auto;
        background: ${theme.backgroundPrimaryColor};
        transition: background 300ms;
      }

      html.admin {
        background: unset;
      }

      * {
        scrollbar-width: thin;
        scrollbar-color: ${theme.thumbColor} ${theme.thumbBackgroundColor};
      }
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: ${theme.thumbBackgroundColor};
      }
      ::-webkit-scrollbar-thumb {
        background-color: ${theme.thumbColor} ;
        border-radius: 6px;
        border: 2px solid ${theme.thumbBackgroundColor};
      }

      body {
        @import url('https://fonts.googleapis.com/css2?family=${FONT_FAMILY.replace(
          ' ',
          '+',
        )}:wght@300;400;500;700&display=swap');
        font-family: '${FONT_FAMILY}', sans-serif;
      }
    `}
    />
  );
};
