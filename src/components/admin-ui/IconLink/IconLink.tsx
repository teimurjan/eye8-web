/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { useTheme } from 'emotion-theming';
import * as React from 'react';

import { usePreventedDefault } from 'src/hooks/usePreventedDefault';

interface IProps {
  href?: string;
  onClick?: React.MouseEventHandler;
  icon: IconProp;
  className?: string;
  size?: FontAwesomeIconProps['size'];
}

export const IconLink = ({ onClick, icon, className, href, size = 'lg' }: IProps) => {
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
      <FontAwesomeIcon size={size} icon={icon} />
    </a>
  );
};
