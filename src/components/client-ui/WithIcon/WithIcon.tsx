/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import * as React from 'react';

import { IconWrapper } from 'src/components/client-ui/IconWrapper/IconWrapper';
import { mediaQueries } from 'src/styles/media';

interface IProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon: React.ReactNode;
  hideTextOnMobile?: boolean;
}

export const WithIcon = React.forwardRef<HTMLSpanElement, IProps>(
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
