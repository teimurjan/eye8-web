/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import React from 'react';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: 'default' | 'primary';
}

export const Message: React.FC<IProps> = ({ color = 'default', children, className, ...props }) => {
  const theme = useTheme<ClientUITheme>();

  return (
    <div
      className={classNames(className, color)}
      css={css`
        padding: 10px 15px;

        &.default {
          border-left: 5px solid ${theme.borderColor};
          color: ${theme.textColor};
          background: ${theme.backgroundPrimaryColor};
        }

        &.primary {
          border-left: 5px solid ${theme.primaryColor};
          color: ${theme.textColor};
          background: ${theme.backgroundPrimaryColor};
        }
      `}
      {...props}
    >
      {children}
    </div>
  );
};
