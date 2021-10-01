
import { css } from '@emotion/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const AdminFiltersSection = ({ children }: Props) => (
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

export default AdminFiltersSection;
