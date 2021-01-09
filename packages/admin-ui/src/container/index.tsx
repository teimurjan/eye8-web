/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import React from 'react';

import { mediaQueries } from '@eye8/shared/styles';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Container = ({ children, className, ...props }: Props) => (
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

export default Container;
