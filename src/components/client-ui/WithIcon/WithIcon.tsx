/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

import { mediaQueries } from 'src/styles/media';

interface IProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon: IconProp;
  size?: SizeProp;
  hideTextOnMobile?: boolean;
}

export const WithIcon = React.forwardRef<HTMLSpanElement, IProps>(
  ({ children, icon, size, hideTextOnMobile = false, ...props }, ref) => (
    <span
      ref={ref}
      className={hideTextOnMobile ? 'hide-text-on-mobile' : undefined}
      css={css`
        display: flex;
        align-items: center;
      `}
      {...props}
    >
      <span
        css={css`
          @media ${mediaQueries.maxWidth768} {
            .hide-text-on-mobile & {
              display: none;
            }
          }
        `}
      >
        {children}
      </span>
      <FontAwesomeIcon
        css={css`
          margin-left: 5px;

          @media ${mediaQueries.maxWidth768} {
            .hide-text-on-mobile & {
              margin-left: 10px;
            }
          }
        `}
        icon={icon}
        size={size}
      />
    </span>
  ),
);
