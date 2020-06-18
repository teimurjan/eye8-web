import { Global, css } from '@emotion/core';
import * as React from 'react';

const FONT_FAMILY = 'Jost';
export const GlobalStyles = () => (
  <Global
    styles={css`
      body {
        @import url('https://fonts.googleapis.com/css2?family=${FONT_FAMILY.replace(' ', '+')}:wght@300;400;500;700&display=swap');
        font-family: '${FONT_FAMILY}', sans-serif;
      }
    `}
  />
);
