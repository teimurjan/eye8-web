/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import * as React from 'react';

import { mediaQueries } from 'src/styles/media';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Container = ({ children, className, ...props }: IProps) => (
  <div
    css={css`
      box-sizing: border-box;

      @media ${mediaQueries.maxWidth768} {
        padding: 0 15px;
        width: 100%;
      }
    `}
    className={classNames(className, 'container')}
    {...props}
  >
    {children}
  </div>
);
