import { Global, css, useTheme } from '@emotion/react';
import React from 'react';

const GlobalStyles = () => {
  const theme = useTheme() as ClientUITheme;

  return (
    <Global
      styles={css`
        html {
          overflow: auto;
          background: ${theme.backgroundPrimaryColor};
          transition: background 300ms;
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
          background-color: ${theme.thumbColor};
          border-radius: 6px;
          border: 2px solid ${theme.thumbBackgroundColor};
        }

        body {
          font-family: 'Jost', sans-serif;
        }
      `}
    />
  );
};

export default GlobalStyles;
