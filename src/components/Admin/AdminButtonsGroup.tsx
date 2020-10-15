/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';

interface IProps {
  children: React.ReactNode;
}

export const AdminButtonsGroup = ({ children }: IProps) => (
  <div
    css={css`
      display: flex;
      justify-content: space-between;
    `}
  >
    {children}
  </div>
);
