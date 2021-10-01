

import { css } from '@emotion/react';
import { useTheme } from '@emotion/react';
import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
}

const LoaderLayout = ({ color, ...props }: Props) => {
  const theme = useTheme() as ClientUITheme;

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
