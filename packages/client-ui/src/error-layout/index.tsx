/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';

import { Title } from '@eye8/client-ui';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const ErrorLayout = ({ children, ...props }: Props) => (
  <div
    css={css`
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100vh;
    `}
    {...props}
  >
    <Title size={2}>{children}</Title>
  </div>
);

export default ErrorLayout;
