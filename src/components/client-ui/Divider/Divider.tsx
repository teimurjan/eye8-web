/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import * as React from 'react';

enum Color {
  lightGray = 'lightGray',
}

export interface IProps extends React.HTMLAttributes<HTMLHRElement> {
  className?: string;
  color?: Color;
}

export const Divider = ({ className, color }: IProps) => {
  const theme = useTheme<ClientUITheme>();
  return (
    <hr
      className={classNames(color, className)}
      css={css`
        margin: 10px 0;
        background: ${theme.borderColor};
        height: 1px;

        &.lightGray {
          background: ${theme.borderLightGrayColor};
        }
      `}
    />
  );
};

Divider.Color = Color;
