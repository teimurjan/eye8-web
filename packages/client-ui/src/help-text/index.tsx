/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import React from 'react';

enum Color {
  Danger = 'danger',
  Success = 'success',
  Gray = 'gray',
}

export interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  color?: Color;
}

const HelpText = ({ children, className, color = Color.Gray, ...props }: Props) => {
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

        &.gray {
          color: ${theme.textSecondaryColor};
        }
      `}
      className={classNames(className, color)}
      {...props}
    >
      {children}
    </small>
  );
};

HelpText.Color = Color;

export default HelpText;
