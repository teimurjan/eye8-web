/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';

import { mediaQueries } from '@eye8/shared/styles';

export interface Props extends React.HTMLProps<HTMLDivElement> {}

const Container = ({ children }: Props) => (
  <div
    css={css`
      flex-grow: 1;
      margin: 0 auto;
      position: relative;
      width: auto;

      @media ${mediaQueries.maxWidth1024} {
        padding: 0 2.5vw;
      }

      @media ${mediaQueries.minWidth1024} {
        max-width: 960px;
      }

      @media ${mediaQueries.minWidth1216} {
        max-width: 1152px;
      }

      @media ${mediaQueries.minWidth1440} {
        max-width: 1344px;
      }
    `}
  >
    {children}
  </div>
);

export default Container;
