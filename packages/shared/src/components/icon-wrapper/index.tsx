/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';

export interface Props extends React.HTMLProps<HTMLSpanElement> {
  children: React.ReactNode;
}

const IconWrapper = React.forwardRef<HTMLSpanElement, Props>(({ children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      css={css`
        display: inline-flex;
        align-items: center;
        justify-content: center;
      `}
      {...props}
    >
      {children}
    </span>
  );
});

export default IconWrapper;
