/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';

interface IProps {
  children: React.ReactNode;
}

export const AdminFiltersSection = ({ children }: IProps) => (
  <div
    css={css`
      margin-bottom: 20px;
    `}
  >
    {children}
  </div>
);
