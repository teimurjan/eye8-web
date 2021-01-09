/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

export const AdminFiltersSection = ({ children }: Props) => (
  <div
    css={css`
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
    `}
  >
    {children}
  </div>
);
