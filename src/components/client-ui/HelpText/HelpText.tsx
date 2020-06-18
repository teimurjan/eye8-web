/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'default' | 'danger' | 'success';
}

export const HelpText: React.FC<IProps> = ({ children, className, color, ...props }) => {
  const theme = useTheme<ClientUITheme>();
  return (
    <small
      css={css`
        &.danger {
          color: ${theme.dangerColor};
        }

        &.success {
          color: ${theme.successColor};
        }
      `}
      className={classNames(className, color)}
      {...props}
    >
      {children}
    </small>
  );
};
