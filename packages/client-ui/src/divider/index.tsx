import { css, useTheme } from '@emotion/react';
import classNames from 'classnames';
import React from 'react';

export enum Color {
  lightGray = 'lightGray',
}

export interface Props extends React.HTMLAttributes<HTMLHRElement> {
  className?: string;
  color?: Color;
}

const Divider = ({ className, color }: Props) => {
  const theme = useTheme() as ClientUITheme;
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

export default Divider;
