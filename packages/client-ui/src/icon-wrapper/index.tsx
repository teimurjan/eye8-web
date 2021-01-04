/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';

export interface IProps extends React.HTMLProps<HTMLSpanElement> {
  children: React.ReactNode;
}

export default React.forwardRef<HTMLSpanElement, IProps>(({ children, ...props }, ref) => {
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
