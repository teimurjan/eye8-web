/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import React from 'react';

import { usePreventedDefault } from '@eye8/shared/hooks';

export interface IProps {
  href?: string;
  onClick?: React.MouseEventHandler;
  icon: React.ReactNode;
  className?: string;
}

export default ({ onClick, icon, className, href }: IProps) => {
  const theme = useTheme<AdminUITheme>();
  const preventedOnClick = usePreventedDefault(onClick);

  return (
    <a
      href={href || '#'}
      css={css`
        padding: 7px;
        color: ${theme.dark} !important;

        &:hover {
          background-color: ${theme.light};
        }
      `}
      className={className}
      onClick={href ? onClick : preventedOnClick}
    >
      {icon}
    </a>
  );
};
