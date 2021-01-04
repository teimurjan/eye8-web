/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
}

const LoaderLayout = ({ color, ...props }: IProps) => {
  const theme = useTheme<ClientUITheme>();

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
      `}
      {...props}
    >
      <ClipLoader color={color || theme.primaryColor} sizeUnit="rem" size={3} loading={true} />
    </div>
  );
};

export default LoaderLayout;
