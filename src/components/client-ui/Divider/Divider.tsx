/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import * as React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLHRElement> {
  className?: string;
}

export const Divider = ({ className }: IProps) => {
  const theme = useTheme<ClientUITheme>();
  return (
    <hr
      css={css`
        margin: 10px 0;
        background: ${theme.borderColor};
        height: 1px;
      `}
      className={className}
    />
  );
};
