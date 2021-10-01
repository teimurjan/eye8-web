
import { css } from '@emotion/react';
import React from 'react';

import { IconWrapper } from '@eye8/shared/components';
import { mediaQueries } from '@eye8/shared/styles';

export interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  icon: React.ReactNode;
  hideTextOnMobile?: boolean;
}

export default React.forwardRef<HTMLSpanElement, Props>(
  ({ children, icon, hideTextOnMobile = false, ...props }, ref) => (
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
      <IconWrapper
        css={css`
          margin-left: 5px;

          @media ${mediaQueries.maxWidth768} {
            .hide-text-on-mobile & {
              margin-left: 10px;
            }
          }
        `}
      >
        {icon}
      </IconWrapper>
    </span>
  ),
);
