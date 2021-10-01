
import { css, useTheme } from '@emotion/react';
import React from 'react';

import { usePreventedDefault } from '@eye8/shared/hooks';

export interface Props {
  href?: string;
  onClick?: React.MouseEventHandler;
  icon: React.ReactNode;
  className?: string;
}

const IconLink = ({ onClick, icon, className, href }: Props) => {
  const theme = useTheme() as AdminUITheme;
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

export default IconLink;
